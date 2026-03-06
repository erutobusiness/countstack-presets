/**
 * CI Validation Script
 *
 * Validates all preset.json files and registry.json against JSON Schemas.
 * Handles legacy field name normalization before validation.
 *
 * Dependencies (install with `npm install --no-save ajv ajv-formats`):
 *   - ajv
 *   - ajv-formats
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Schema loading ──────────────────────────────────────────

const presetSchema = JSON.parse(
  readFileSync(join(ROOT, 'schema', 'preset.schema.json'), 'utf8'),
);
const registrySchema = JSON.parse(
  readFileSync(join(ROOT, 'schema', 'registry.schema.json'), 'utf8'),
);

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validatePresetSchema = ajv.compile(presetSchema);
const validateRegistrySchema = ajv.compile(registrySchema);

// ─── Legacy → canonical field normalization ──────────────────
// Ported from countstack/src/utils/preset-fetch.ts normalizePreset()

function normalizePreset(obj) {
  if (obj.database && typeof obj.database === 'object') {
    const database = obj.database;
    if (!database.entries && Array.isArray(database.pokemon)) {
      database.entries = database.pokemon;
      delete database.pokemon;
    }
    if (!database.groups && Array.isArray(database.trainers)) {
      database.groups = database.trainers;
      delete database.trainers;
    }
    // SourceGroup members: trainers[].pokemon → groups[].members
    if (Array.isArray(database.groups)) {
      for (const g of database.groups) {
        if (g && typeof g === 'object') {
          if (!g.members && Array.isArray(g.pokemon)) {
            g.members = g.pokemon;
            delete g.pokemon;
          }
        }
      }
    }
    // DatabaseEntry fields: dexNumber → catalogNumber → sortOrder, availability → tags
    // yield → values
    if (Array.isArray(database.entries)) {
      for (const e of database.entries) {
        if (e && typeof e === 'object') {
          if (e.sortOrder === undefined && e.catalogNumber !== undefined) {
            e.sortOrder = e.catalogNumber;
            delete e.catalogNumber;
          }
          if (e.sortOrder === undefined && e.dexNumber !== undefined) {
            e.sortOrder = e.dexNumber;
            delete e.dexNumber;
          }
          if (e.values === undefined && e.yield !== undefined) {
            e.values = e.yield;
            delete e.yield;
          }
          if (e.tags === undefined && Array.isArray(e.availability)) {
            e.tags = e.availability;
            delete e.availability;
          }
        }
      }
    }
    // SourceGroup: totalYield → totalValues, members[].yield → members[].values
    if (Array.isArray(database.groups)) {
      for (const g of database.groups) {
        if (g && typeof g === 'object') {
          if (g.totalValues === undefined && g.totalYield !== undefined) {
            g.totalValues = g.totalYield;
            delete g.totalYield;
          }
          if (Array.isArray(g.members)) {
            for (const m of g.members) {
              if (m && typeof m === 'object' && m.values === undefined && m.yield !== undefined) {
                m.values = m.yield;
                delete m.yield;
              }
            }
          }
        }
      }
    }
  }

  // multipliers[].scope: "battle" → "source"
  if (Array.isArray(obj.multipliers)) {
    for (const m of obj.multipliers) {
      if (m && typeof m === 'object' && m.scope === 'battle') {
        m.scope = 'source';
      }
    }
  }

  // vitamins → items
  if (!obj.items && Array.isArray(obj.vitamins)) {
    obj.items = obj.vitamins;
    delete obj.vitamins;
  }
  if (obj.itemsAffectedByMultipliers === undefined && obj.vitaminsAffectedByMultipliers !== undefined) {
    obj.itemsAffectedByMultipliers = obj.vitaminsAffectedByMultipliers;
    delete obj.vitaminsAffectedByMultipliers;
  }

  return obj;
}

// ─── Discover preset directories ─────────────────────────────

const EXCLUDED_DIRS = new Set(['node_modules', '.cache', '.git', '.github', 'schema', 'scripts']);

function discoverPresets() {
  const presets = [];
  for (const entry of readdirSync(ROOT)) {
    if (EXCLUDED_DIRS.has(entry)) continue;
    const dirPath = join(ROOT, entry);
    try {
      if (!statSync(dirPath).isDirectory()) continue;
    } catch {
      continue;
    }
    const presetPath = join(dirPath, 'preset.json');
    try {
      statSync(presetPath);
      presets.push({ id: entry, dir: dirPath, path: presetPath });
    } catch {
      // No preset.json in this directory
    }
  }
  return presets;
}

// ─── Validation ──────────────────────────────────────────────

let errors = 0;

function error(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function success(msg) {
  console.log(`  ✓ ${msg}`);
}

// Validate each preset
const presets = discoverPresets();

if (presets.length === 0) {
  console.log('No preset directories found.');
  process.exit(0);
}

console.log(`Found ${presets.length} preset(s):\n`);

/** @type {Map<string, object>} validated preset data keyed by directory name */
const validatedPresets = new Map();

for (const preset of presets) {
  console.log(`[${preset.id}]`);

  // Parse JSON
  let data;
  try {
    const raw = readFileSync(preset.path, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    error(`Failed to parse ${preset.path}: ${e.message}`);
    continue;
  }
  success('Valid JSON');

  // Normalize legacy fields
  normalizePreset(data);

  // JSON Schema validation
  const valid = validatePresetSchema(data);
  if (!valid) {
    for (const err of validatePresetSchema.errors) {
      error(`Schema: ${err.instancePath || '/'} ${err.message}`);
    }
  } else {
    success('Schema validation passed');
  }

  // meta.id matches directory name
  if (data.meta?.id !== preset.id) {
    error(`meta.id "${data.meta?.id}" does not match directory name "${preset.id}"`);
  } else {
    success(`meta.id matches directory name`);
  }

  // Cross-reference: items[].counter must exist in counters[].id
  if (Array.isArray(data.counters) && Array.isArray(data.items)) {
    const counterIds = new Set(data.counters.map((c) => c.id));
    for (const item of data.items) {
      if (item.counter && !counterIds.has(item.counter)) {
        error(`Item "${item.id}" references unknown counter "${item.counter}"`);
      }
    }
    if (!validatePresetSchema.errors) {
      success('Item-counter cross-references valid');
    }
  }

  validatedPresets.set(preset.id, data);
  console.log();
}

// Validate registry.json
console.log('[registry.json]');

let registry;
try {
  const raw = readFileSync(join(ROOT, 'registry.json'), 'utf8');
  registry = JSON.parse(raw);
} catch (e) {
  error(`Failed to parse registry.json: ${e.message}`);
  process.exit(1);
}
success('Valid JSON');

const registryValid = validateRegistrySchema(registry);
if (!registryValid) {
  for (const err of validateRegistrySchema.errors) {
    error(`Schema: ${err.instancePath || '/'} ${err.message}`);
  }
} else {
  success('Schema validation passed');
}

// Check that every preset directory has a registry entry
if (Array.isArray(registry.presets)) {
  const registryIds = new Set(registry.presets.map((p) => p.id));

  for (const preset of presets) {
    if (!registryIds.has(preset.id)) {
      error(`Preset directory "${preset.id}" has no entry in registry.json`);
    }
  }

  // Check version consistency and dataUrl pattern
  for (const entry of registry.presets) {
    const presetData = validatedPresets.get(entry.id);
    if (presetData) {
      if (entry.version !== presetData.meta?.version) {
        error(
          `Registry version "${entry.version}" for "${entry.id}" does not match preset meta.version "${presetData.meta?.version}"`,
        );
      } else {
        success(`Version "${entry.version}" matches for "${entry.id}"`);
      }
    }

    // dataUrl pattern check
    const expectedUrlPattern = `https://erutobusiness.github.io/countstack-presets/${entry.id}/preset.json`;
    if (entry.dataUrl !== expectedUrlPattern) {
      error(
        `dataUrl for "${entry.id}" should be "${expectedUrlPattern}" but got "${entry.dataUrl}"`,
      );
    } else {
      success(`dataUrl correct for "${entry.id}"`);
    }
  }
}

console.log();

if (errors > 0) {
  console.error(`Validation failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('All validations passed.');
}

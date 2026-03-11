/**
 * build-preset.ts
 *
 * Builds all presets by injecting generated data into base preset.json files.
 * Also updates registry.json with the correct size and counts.
 *
 * Usage: npm run generate:build
 */

import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = resolve(__dirname, "../registry.json");

interface RegistryPreset {
  id: string;
  size: number;
  entryCount: number;
  groupCount: number;
  labels?: Record<string, Record<string, string>>;
}

function updateRegistry(id: string, presetPath: string, entryCount: number, groupCount: number, labels?: Record<string, Record<string, string>>) {
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));
  const entry = registry.presets.find((p: RegistryPreset) => p.id === id);
  if (entry) {
    entry.size = statSync(presetPath).size;
    entry.entryCount = entryCount;
    entry.groupCount = groupCount;
    if (labels) entry.labels = labels;
    registry.updatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  }
}

async function buildFrlg() {
  const presetPath = resolve(__dirname, "../presets/frlg/preset.json");
  const pokemonPath = resolve(__dirname, "../presets/frlg/pokemon.json");

  const preset = JSON.parse(readFileSync(presetPath, "utf-8"));
  const pokemon = JSON.parse(readFileSync(pokemonPath, "utf-8"));

  preset.database.entries = pokemon;

  const { frlgTrainers } = await import("./frlg-trainers.ts");
  preset.database.groups = frlgTrainers;

  writeFileSync(presetPath, JSON.stringify(preset, null, 2));
  updateRegistry("frlg", presetPath, pokemon.length, preset.database.groups.length, preset.labels);

  console.log(`[frlg] ${pokemon.length} entries, ${preset.database.groups.length} groups (${(statSync(presetPath).size / 1024).toFixed(1)} KB)`);
}

async function buildDnd5eXp() {
  const presetPath = resolve(__dirname, "../presets/dnd5e-xp/preset.json");
  const monstersPath = resolve(__dirname, "../presets/dnd5e-xp/monsters.json");

  if (!existsSync(monstersPath)) {
    console.log("[dnd5e-xp] monsters.json not found — run generate-dnd5e-db.ts first");
    return;
  }

  const preset = JSON.parse(readFileSync(presetPath, "utf-8"));
  const monsters = JSON.parse(readFileSync(monstersPath, "utf-8"));

  preset.database.entries = monsters.entries;
  preset.database.groups = monsters.groups;

  writeFileSync(presetPath, JSON.stringify(preset, null, 2));
  updateRegistry("dnd5e-xp", presetPath, monsters.entries.length, monsters.groups.length, preset.labels);

  console.log(`[dnd5e-xp] ${monsters.entries.length} entries, ${monsters.groups.length} groups (${(statSync(presetPath).size / 1024).toFixed(1)} KB)`);
}

async function main() {
  await buildFrlg();
  await buildDnd5eXp();
  console.log("Registry updated.");
}

main();

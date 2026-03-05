/**
 * build-preset.ts
 *
 * Reads the base preset.json and injects the generated pokemon.json
 * and trainer data. Also updates registry.json with the correct size and counts.
 *
 * Usage: npm run generate:build
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRESET_PATH = resolve(__dirname, "../frlg/preset.json");
const POKEMON_PATH = resolve(__dirname, "../frlg/pokemon.json");
const REGISTRY_PATH = resolve(__dirname, "../registry.json");

async function main() {
  const preset = JSON.parse(readFileSync(PRESET_PATH, "utf-8"));
  const pokemon = JSON.parse(readFileSync(POKEMON_PATH, "utf-8"));

  // Inject pokemon data
  preset.database.entries = pokemon;

  // Inject trainer data
  const { frlgTrainers } = await import("./frlg-trainers.ts");
  preset.database.groups = frlgTrainers;

  // Write final preset
  writeFileSync(PRESET_PATH, JSON.stringify(preset, null, 2));

  // Update registry.json with counts and size
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));
  const frlgEntry = registry.presets.find((p: any) => p.id === "frlg");
  if (frlgEntry) {
    const presetSize = statSync(PRESET_PATH).size;
    frlgEntry.size = presetSize;
    frlgEntry.entryCount = pokemon.length;
    frlgEntry.groupCount = preset.database.groups.length;
    registry.updatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  }

  console.log(`Built preset: ${pokemon.length} Pokémon, ${preset.database.groups.length} trainers`);
  console.log(`Preset size: ${(statSync(PRESET_PATH).size / 1024).toFixed(1)} KB`);
  console.log("Updated registry.json");
}

main();

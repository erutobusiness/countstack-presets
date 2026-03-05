/**
 * generate-pokemon-db.ts
 *
 * Fetches EV yield data for all Gen 1-3 Pokémon (#1-386) from PokeAPI,
 * including Japanese/English names and FRLG version availability.
 *
 * Output: frlg/pokemon.json
 *
 * Usage: npm run generate:pokemon
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../frlg/pokemon.json");
const CACHE_PATH = resolve(__dirname, "../.cache/pokemon-raw.json");

const TOTAL_POKEMON = 386;
const BATCH_SIZE = 20;
const DELAY_MS = 500;

// PokeAPI stat name -> our counter id
const STAT_MAP: Record<string, string> = {
  hp: "hp",
  attack: "atk",
  defense: "def",
  "special-attack": "spa",
  "special-defense": "spd",
  speed: "spe",
};

// FRLG version availability mapping
// Pokemon appearing in wild encounters, gifts, or static encounters.
// Pokemon not in this map are still included (for trade-in EV training)
// but have availability: [] (not natively obtainable in FRLG).

// FireRed exclusives (not in LeafGreen)
const FR_ONLY = new Set([
  23, 24, // Ekans, Arbok
  43, 44, 45, // Oddish, Gloom, Vileplume
  54, 55, // Psyduck, Golduck
  58, 59, // Growlithe, Arcanine
  90, 91, // Shellder, Cloyster
  123,    // Scyther
  125,    // Electabuzz
  194, 195, // Wooper, Quagsire
  198,    // Murkrow
  211,    // Qwilfish
  225,    // Delibird
  227,    // Skarmory
  239,    // Elekid
]);

// LeafGreen exclusives (not in FireRed)
const LG_ONLY = new Set([
  27, 28, // Sandshrew, Sandslash
  37, 38, // Vulpix, Ninetales
  69, 70, 71, // Bellsprout, Weepinbell, Victreebel
  79, 80, // Slowpoke, Slowbro
  120, 121, // Staryu, Starmie
  126,    // Magmar
  127,    // Pinsir
  183, 184, // Marill, Azumarill
  200,    // Misdreavus
  215,    // Sneasel
  223, 224, // Remoraid, Octillery
  226,    // Mantine
  240,    // Magby
  298,    // Azurill
]);

// Pokemon obtainable in both FR and LG (Kanto #1-151 base + Sevii Islands Gen 2)
// All Kanto Pokemon (#1-151) not in FR_ONLY or LG_ONLY are in both.
// Sevii Islands Gen 2 (both versions)
const BOTH_SEVII = new Set([
  161, 162, // Sentret, Furret
  163, 164, // Hoothoot, Noctowl
  165, 166, // Ledyba, Ledian
  167, 168, // Spinarak, Ariados
  169,      // Crobat (evolve Golbat)
  170, 171, // Chinchou, Lanturn
  172,      // Pichu (breed)
  173,      // Cleffa (breed)
  174,      // Igglybuff (breed)
  175, 176, // Togepi, Togetic
  177, 178, // Natu, Xatu
  186,      // Politoed (trade evolve)
  187, 188, 189, // Hoppip, Skiploom, Jumpluff
  190,      // Aipom
  193,      // Yanma
  201,      // Unown
  202,      // Wobbuffet
  206,      // Dunsparce
  208,      // Steelix (trade evolve)
  212,      // Scizor (trade evolve) -- actually FR only for wild Scyther, but Scizor is obtainable
  213,      // Shuckle
  214,      // Heracross
  218, 219, // Slugma, Magcargo
  220, 221, // Swinub, Piloswine
  228, 229, // Houndour, Houndoom
  230,      // Kingdra (trade evolve)
  231, 232, // Phanpy, Donphan
  233,      // Porygon2 (trade evolve)
  234,      // Stantler
  235,      // Smeargle
  236,      // Tyrogue (breed)
  237,      // Hitmontop (evolve Tyrogue)
  238,      // Smoochum (breed)
  241,      // Miltank
  242,      // Blissey (evolve Chansey)
  246, 247, 248, // Larvitar, Pupitar, Tyranitar
  249,      // Lugia (event)
  250,      // Ho-Oh (event)
  360,      // Wynaut (breed)
]);

// Pokémon not obtainable in FRLG at all
const NOT_IN_FRLG = new Set([
  196, 197, // Espeon, Umbreon (no day/night)
]);

// Deoxys has different formes (and EV yields) per version.
// FR = Attack Forme, LG = Defense Forme. Replaces the single PokeAPI entry.
const DEOXYS_FORMES = [
  {
    id: "deoxys-attack",
    catalogNumber: 386,
    nameJa: "デオキシス（アタック）",
    nameEn: "Deoxys (Attack)",
    yield: { atk: 1, spa: 1, spe: 1 } as Record<string, number>,
    tags: ["fr"] as ("fr" | "lg")[],
  },
  {
    id: "deoxys-defense",
    catalogNumber: 386,
    nameJa: "デオキシス（ディフェンス）",
    nameEn: "Deoxys (Defense)",
    yield: { def: 1, spd: 1, spe: 1 } as Record<string, number>,
    tags: ["lg"] as ("fr" | "lg")[],
  },
];

interface PokemonRaw {
  id: number;
  nameEn: string;
  nameJa: string;
  yield: Record<string, number>;
}

// Special-case ID generation for Nidoran (♀/♂ → f/m)
function generateId(nameEn: string, dexNum: number): string {
  if (dexNum === 29) return "nidoran-f";
  if (dexNum === 32) return "nidoran-m";
  return nameEn.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+$/, "");
}

function getAvailability(dexNum: number): ("fr" | "lg")[] {
  if (NOT_IN_FRLG.has(dexNum)) return [];

  // Gen 3 Pokemon (#252-386) are generally not in FRLG
  // except specific ones added to BOTH_SEVII, FR_ONLY, or LG_ONLY
  if (dexNum > 251 && !BOTH_SEVII.has(dexNum) && !FR_ONLY.has(dexNum) && !LG_ONLY.has(dexNum)) {
    return [];
  }

  if (FR_ONLY.has(dexNum)) return ["fr"];
  if (LG_ONLY.has(dexNum)) return ["lg"];

  // Kanto (#1-151) not exclusive -> both
  if (dexNum <= 151) return ["fr", "lg"];

  // Sevii Islands Gen 2 both versions
  if (BOTH_SEVII.has(dexNum)) return ["fr", "lg"];

  // Gen 2 Pokemon (#152-251) not in any set -> not obtainable
  return [];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

async function fetchPokemon(id: number): Promise<PokemonRaw> {
  const [pokemon, species] = await Promise.all([
    fetchJson<any>(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetchJson<any>(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  // Extract EV yield (only non-zero stats)
  const evYield: Record<string, number> = {};
  for (const stat of pokemon.stats) {
    if (stat.effort > 0) {
      const key = STAT_MAP[stat.stat.name];
      if (key) evYield[key] = stat.effort;
    }
  }

  // Get Japanese name
  const jaName = species.names.find(
    (n: any) => n.language.name === "ja-Hrkt" || n.language.name === "ja"
  );
  const enName = species.names.find((n: any) => n.language.name === "en");

  return {
    id,
    nameEn: enName?.name ?? pokemon.name,
    nameJa: jaName?.name ?? pokemon.name,
    yield: evYield,
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAll(): Promise<PokemonRaw[]> {
  // Use cache if available
  if (existsSync(CACHE_PATH)) {
    console.log("Using cached raw data from", CACHE_PATH);
    return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
  }

  const results: PokemonRaw[] = [];

  for (let i = 0; i < TOTAL_POKEMON; i += BATCH_SIZE) {
    const batch = Array.from(
      { length: Math.min(BATCH_SIZE, TOTAL_POKEMON - i) },
      (_, j) => i + j + 1
    );

    console.log(
      `Fetching #${batch[0]}-#${batch[batch.length - 1]} (${results.length}/${TOTAL_POKEMON})...`
    );

    const batchResults = await Promise.all(batch.map(fetchPokemon));
    results.push(...batchResults);

    if (i + BATCH_SIZE < TOTAL_POKEMON) {
      await sleep(DELAY_MS);
    }
  }

  // Cache raw results
  const cacheDir = dirname(CACHE_PATH);
  const { mkdirSync } = await import("node:fs");
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(CACHE_PATH, JSON.stringify(results, null, 2));
  console.log("Cached raw data to", CACHE_PATH);

  return results;
}

async function main() {
  console.log(`Generating Pokémon DB for FRLG (#1-${TOTAL_POKEMON})...\n`);

  const rawData = await fetchAll();

  // Transform to preset format
  const pokemon = rawData.map((p) => ({
    id: generateId(p.nameEn, p.id),
    catalogNumber: p.id,
    name: { ja: p.nameJa, en: p.nameEn },
    yield: p.yield,
    tags: getAvailability(p.id),
  }));

  // Replace Deoxys Normal with forme-specific entries
  const deoxysIdx = pokemon.findIndex((p) => p.catalogNumber === 386);
  if (deoxysIdx !== -1) {
    pokemon.splice(deoxysIdx, 1, ...DEOXYS_FORMES.map((f) => ({
      id: f.id,
      catalogNumber: f.catalogNumber,
      name: { ja: f.nameJa, en: f.nameEn },
      yield: f.yield,
      tags: f.tags,
    })));
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(pokemon, null, 2));

  // Stats
  const withFrlg = pokemon.filter((p) => p.tags.length > 0);
  const frOnly = pokemon.filter(
    (p) => p.tags.length === 1 && p.tags[0] === "fr"
  );
  const lgOnly = pokemon.filter(
    (p) => p.tags.length === 1 && p.tags[0] === "lg"
  );

  console.log(`\nDone! Wrote ${pokemon.length} Pokémon to ${OUTPUT_PATH}`);
  console.log(`  FRLG obtainable: ${withFrlg.length}`);
  console.log(`  FR exclusive: ${frOnly.length}`);
  console.log(`  LG exclusive: ${lgOnly.length}`);
  console.log(`  Not in FRLG: ${pokemon.length - withFrlg.length}`);
}

main().catch(console.error);

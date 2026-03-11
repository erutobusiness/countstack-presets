/**
 * generate-dnd5e-db.ts
 *
 * Fetches SRD 5.1 monster data from the 5e-bits API and generates
 * database entries and CR-based groups for the D&D 5e XP preset.
 *
 * Data source: https://www.dnd5eapi.co/api/2014/monsters
 * License: SRD 5.1 content is CC-BY-4.0 by Wizards of the Coast LLC
 *
 * Usage: npx tsx scripts/generate-dnd5e-db.ts
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../presets/dnd5e-xp/monsters.json");

const API_BASE = "https://www.dnd5eapi.co/api/2014/monsters";

interface ApiMonsterSummary {
  index: string;
  name: string;
  url: string;
}

interface ApiMonster {
  index: string;
  name: string;
  size: string;
  type: string;
  subtype?: string;
  challenge_rating: number;
  xp: number;
}

interface DatabaseEntry {
  id: string;
  sortOrder: number;
  name: { en: string; ja: string };
  values: { xp: number };
  tags: string[];
}

interface SourceGroup {
  id: string;
  name: { en: string; ja: string };
  location: { en: string; ja: string };
  members: Array<{
    name: { en: string; ja: string };
    level: number;
    values: { xp: number };
  }>;
  totalValues: { xp: number };
  rematchable: boolean;
}

/** Format CR for display (0.125 → "1/8", 0.25 → "1/4", 0.5 → "1/2") */
function formatCR(cr: number): string {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
}

/** CR tag for filtering */
function crTag(cr: number): string {
  return `cr-${formatCR(cr).replace("/", "_")}`;
}

/** Type tag (lowercase, normalized) */
function typeTag(type: string): string {
  // "swarm of Tiny beasts" → "swarm"
  const lower = type.toLowerCase();
  if (lower.startsWith("swarm")) return "swarm";
  return lower;
}

async function fetchAllMonsters(): Promise<ApiMonster[]> {
  console.log("Fetching monster list...");
  const listRes = await fetch(API_BASE);
  const listData = (await listRes.json()) as { results: ApiMonsterSummary[] };
  console.log(`Found ${listData.results.length} monsters`);

  // Fetch all monster details in batches of 10 (API rate limit: 100/s)
  const monsters: ApiMonster[] = [];
  const batchSize = 10;

  for (let i = 0; i < listData.results.length; i += batchSize) {
    const batch = listData.results.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (m) => {
        const res = await fetch(`${API_BASE}/${m.index}`);
        return (await res.json()) as ApiMonster;
      })
    );
    monsters.push(...results);
    process.stdout.write(`\r  Fetched ${monsters.length}/${listData.results.length}`);
    // Respect API rate limit
    if (i + batchSize < listData.results.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  console.log();

  return monsters;
}

function buildEntries(monsters: ApiMonster[]): DatabaseEntry[] {
  // Sort by CR, then by name
  const sorted = [...monsters].sort((a, b) => {
    if (a.challenge_rating !== b.challenge_rating) return a.challenge_rating - b.challenge_rating;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((m, i) => ({
    id: m.index,
    sortOrder: i + 1,
    name: { en: m.name, ja: m.name }, // SRD is English-only
    values: { xp: m.xp },
    tags: [crTag(m.challenge_rating), typeTag(m.type)],
  }));
}

function buildGroups(monsters: ApiMonster[]): SourceGroup[] {
  // Group by CR band
  const crBands = new Map<number, ApiMonster[]>();
  for (const m of monsters) {
    const cr = m.challenge_rating;
    if (!crBands.has(cr)) crBands.set(cr, []);
    crBands.get(cr)!.push(m);
  }

  // Sort CR bands
  const sortedCRs = [...crBands.keys()].sort((a, b) => a - b);

  return sortedCRs.map((cr) => {
    const members = crBands.get(cr)!.sort((a, b) => a.name.localeCompare(b.name));
    const crLabel = formatCR(cr);
    const totalXp = members.reduce((sum, m) => sum + m.xp, 0);
    const allSameXp = members.every((m) => m.xp === members[0].xp);

    return {
      id: `cr-${crLabel.replace("/", "_")}`,
      name: {
        en: allSameXp
          ? `CR ${crLabel} (${members[0].xp.toLocaleString()} XP each)`
          : `CR ${crLabel} (${Math.min(...members.map((m) => m.xp)).toLocaleString()}–${Math.max(...members.map((m) => m.xp)).toLocaleString()} XP)`,
        ja: allSameXp
          ? `CR ${crLabel}（各${members[0].xp.toLocaleString()} XP）`
          : `CR ${crLabel}（${Math.min(...members.map((m) => m.xp)).toLocaleString()}–${Math.max(...members.map((m) => m.xp)).toLocaleString()} XP）`,
      },
      location: {
        en: `${members.length} ${members.length === 1 ? "monster" : "monsters"}`,
        ja: `${members.length}体`,
      },
      members: members.map((m) => ({
        name: { en: m.name, ja: m.name },
        level: cr >= 1 ? cr : 1,
        values: { xp: m.xp },
      })),
      totalValues: { xp: totalXp },
      rematchable: true,
    };
  });
}

async function main() {
  const monsters = await fetchAllMonsters();

  const entries = buildEntries(monsters);
  const groups = buildGroups(monsters);

  const output = { entries, groups };
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Stats
  const types = new Set(monsters.map((m) => m.type));
  const crs = new Set(monsters.map((m) => m.challenge_rating));

  console.log(`\nGenerated: ${entries.length} entries, ${groups.length} CR groups`);
  console.log(`Types: ${[...types].sort().join(", ")}`);
  console.log(`CR range: ${formatCR(Math.min(...crs))} - ${Math.max(...crs)}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main();

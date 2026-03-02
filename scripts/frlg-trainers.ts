/**
 * frlg-trainers.ts
 *
 * Trainer data for FRLG EV training.
 * Focuses on Vs. Seeker rematchable trainers commonly used for EV training.
 * Data sourced from Smogon FRLG EV Training Guide and Bulbapedia.
 *
 * Format follows TrainerEntry from countstack preset schema.
 */

export interface TrainerPokemon {
  name: string;
  level: number;
  yield: Record<string, number>;
}

export interface TrainerEntry {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  locationEn: string;
  pokemon: TrainerPokemon[];
  totalYield: Record<string, number>;
  rematchable: boolean;
}

function sumYields(pokemon: TrainerPokemon[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const p of pokemon) {
    for (const [stat, value] of Object.entries(p.yield)) {
      total[stat] = (total[stat] ?? 0) + value;
    }
  }
  return total;
}

function trainer(
  id: string,
  name: string,
  nameEn: string,
  location: string,
  locationEn: string,
  pokemon: TrainerPokemon[],
  rematchable: boolean,
): TrainerEntry {
  return {
    id,
    name,
    nameEn,
    location,
    locationEn,
    pokemon,
    totalYield: sumYields(pokemon),
    rematchable,
  };
}

// ── HP EV Trainers ──────────────────────────────────────────────

const hpTrainers: TrainerEntry[] = [
  trainer(
    "tuber-f-route19",
    "うきわガール（19ばんすいどう）",
    "Tuber♀ (Route 19)",
    "19ばんすいどう",
    "Route 19",
    [
      { name: "Staryu", level: 17, yield: { spe: 1 } },
      { name: "Staryu", level: 17, yield: { spe: 1 } },
    ],
    true,
  ),
  trainer(
    "cooltrainer-f-route19",
    "エリートトレーナー♀（19ばんすいどう）",
    "Cooltrainer♀ (Route 19)",
    "19ばんすいどう",
    "Route 19",
    [
      { name: "Seaking", level: 37, yield: { atk: 2 } },
    ],
    true,
  ),
  trainer(
    "aroma-lady-route15",
    "アロマなおねえさん（15ばんどうろ）",
    "Aroma Lady (Route 15)",
    "15ばんどうろ",
    "Route 15",
    [
      { name: "Vileplume", level: 37, yield: { spa: 3 } },
    ],
    true,
  ),
];

// ── Attack EV Trainers ──────────────────────────────────────────

const atkTrainers: TrainerEntry[] = [
  trainer(
    "camper-route14",
    "キャンプボーイ（14ばんどうろ）",
    "Camper (Route 14)",
    "14ばんどうろ",
    "Route 14",
    [
      { name: "Nidorino", level: 38, yield: { atk: 2 } },
    ],
    true,
  ),
  trainer(
    "blackbelt-route12",
    "カラテおう（12ばんどうろ）",
    "Black Belt (Route 12)",
    "12ばんどうろ",
    "Route 12",
    [
      { name: "Machoke", level: 36, yield: { atk: 2 } },
      { name: "Machoke", level: 36, yield: { atk: 2 } },
    ],
    true,
  ),
  trainer(
    "biker-route16",
    "ぼうそうぞく（16ばんどうろ）",
    "Biker (Route 16)",
    "16ばんどうろ",
    "Route 16",
    [
      { name: "Weezing", level: 38, yield: { def: 2 } },
      { name: "Muk", level: 38, yield: { hp: 1, atk: 1 } },
    ],
    true,
  ),
];

// ── Defense EV Trainers ──────────────────────────────────────────

const defTrainers: TrainerEntry[] = [
  trainer(
    "picnicker-route14",
    "ピクニックガール（14ばんどうろ）",
    "Picnicker (Route 14)",
    "14ばんどうろ",
    "Route 14",
    [
      { name: "Nidorina", level: 38, yield: { hp: 2 } },
    ],
    true,
  ),
  trainer(
    "hiker-rocktunel",
    "やまおとこ（イワヤマトンネル）",
    "Hiker (Rock Tunnel)",
    "イワヤマトンネル",
    "Rock Tunnel",
    [
      { name: "Geodude", level: 25, yield: { def: 1 } },
      { name: "Geodude", level: 25, yield: { def: 1 } },
      { name: "Graveler", level: 25, yield: { def: 2 } },
    ],
    true,
  ),
  trainer(
    "youngster-route11",
    "たんパンこぞう（11ばんどうろ）",
    "Youngster (Route 11)",
    "11ばんどうろ",
    "Route 11",
    [
      { name: "Sandslash", level: 31, yield: { def: 2 } },
    ],
    true,
  ),
];

// ── Special Attack EV Trainers ──────────────────────────────────

const spaTrainers: TrainerEntry[] = [
  trainer(
    "psychic-m-route10",
    "サイキッカー♂（10ばんどうろ）",
    "Psychic♂ (Route 10)",
    "10ばんどうろ",
    "Route 10",
    [
      { name: "Slowpoke", level: 33, yield: { hp: 1 } },
      { name: "Slowpoke", level: 33, yield: { hp: 1 } },
      { name: "Slowbro", level: 33, yield: { def: 2 } },
    ],
    true,
  ),
  trainer(
    "beauty-route19",
    "おとなのおねえさん（19ばんすいどう）",
    "Beauty (Route 19)",
    "19ばんすいどう",
    "Route 19",
    [
      { name: "Goldeen", level: 35, yield: { atk: 1 } },
      { name: "Seaking", level: 35, yield: { atk: 2 } },
    ],
    true,
  ),
  trainer(
    "aroma-lady2-route15",
    "アロマなおねえさん2（15ばんどうろ）",
    "Aroma Lady 2 (Route 15)",
    "15ばんどうろ",
    "Route 15",
    [
      { name: "Gloom", level: 34, yield: { spa: 2 } },
      { name: "Gloom", level: 34, yield: { spa: 2 } },
    ],
    true,
  ),
];

// ── Special Defense EV Trainers ──────────────────────────────────

const spdTrainers: TrainerEntry[] = [
  trainer(
    "gentleman-route12",
    "ジェントルマン（12ばんどうろ）",
    "Gentleman (Route 12)",
    "12ばんどうろ",
    "Route 12",
    [
      { name: "Snorlax", level: 38, yield: { hp: 2 } },
    ],
    true,
  ),
  trainer(
    "fisherman-route12a",
    "つりびと（12ばんどうろ）",
    "Fisherman (Route 12)",
    "12ばんどうろ",
    "Route 12",
    [
      { name: "Magikarp", level: 28, yield: { spe: 1 } },
      { name: "Magikarp", level: 28, yield: { spe: 1 } },
      { name: "Magikarp", level: 28, yield: { spe: 1 } },
      { name: "Magikarp", level: 28, yield: { spe: 1 } },
      { name: "Gyarados", level: 28, yield: { atk: 2 } },
    ],
    true,
  ),
  trainer(
    "swimmer-f-route20",
    "かいパンやろう♀（20ばんすいどう）",
    "Swimmer♀ (Route 20)",
    "20ばんすいどう",
    "Route 20",
    [
      { name: "Tentacool", level: 35, yield: { spd: 1 } },
      { name: "Tentacruel", level: 35, yield: { spd: 2 } },
    ],
    true,
  ),
];

// ── Speed EV Trainers ──────────────────────────────────────────

const speTrainers: TrainerEntry[] = [
  trainer(
    "biker-route17a",
    "ぼうそうぞく（17ばんどうろ）A",
    "Biker A (Route 17)",
    "17ばんどうろ",
    "Route 17",
    [
      { name: "Doduo", level: 28, yield: { spe: 1 } },
      { name: "Doduo", level: 28, yield: { spe: 1 } },
      { name: "Dodrio", level: 28, yield: { spe: 2 } },
    ],
    true,
  ),
  trainer(
    "bird-keeper-route18",
    "とりつかい（18ばんどうろ）",
    "Bird Keeper (Route 18)",
    "18ばんどうろ",
    "Route 18",
    [
      { name: "Spearow", level: 29, yield: { spe: 1 } },
      { name: "Fearow", level: 29, yield: { spe: 2 } },
    ],
    true,
  ),
  trainer(
    "biker-route17b",
    "ぼうそうぞく（17ばんどうろ）B",
    "Biker B (Route 17)",
    "17ばんどうろ",
    "Route 17",
    [
      { name: "Voltorb", level: 29, yield: { spe: 1 } },
      { name: "Voltorb", level: 29, yield: { spe: 1 } },
      { name: "Magnemite", level: 29, yield: { spa: 1 } },
    ],
    true,
  ),
];

// ── Key Non-Rematchable Trainers (bosses, gym leaders, etc.) ────

const bossTrainers: TrainerEntry[] = [
  trainer(
    "elite-four-lorelei",
    "してんのう カンナ",
    "Elite Four Lorelei",
    "ポケモンリーグ",
    "Pokémon League",
    [
      { name: "Dewgong", level: 52, yield: { spd: 2 } },
      { name: "Cloyster", level: 51, yield: { def: 2 } },
      { name: "Slowbro", level: 52, yield: { def: 2 } },
      { name: "Jynx", level: 54, yield: { spa: 2 } },
      { name: "Lapras", level: 54, yield: { hp: 2 } },
    ],
    false,
  ),
  trainer(
    "elite-four-bruno",
    "してんのう シバ",
    "Elite Four Bruno",
    "ポケモンリーグ",
    "Pokémon League",
    [
      { name: "Onix", level: 51, yield: { def: 1 } },
      { name: "Hitmonchan", level: 53, yield: { spd: 2 } },
      { name: "Hitmonlee", level: 53, yield: { atk: 2 } },
      { name: "Onix", level: 54, yield: { def: 1 } },
      { name: "Machamp", level: 56, yield: { atk: 3 } },
    ],
    false,
  ),
  trainer(
    "elite-four-agatha",
    "してんのう キクコ",
    "Elite Four Agatha",
    "ポケモンリーグ",
    "Pokémon League",
    [
      { name: "Gengar", level: 54, yield: { spa: 3 } },
      { name: "Golbat", level: 54, yield: { spe: 2 } },
      { name: "Haunter", level: 53, yield: { spa: 2 } },
      { name: "Arbok", level: 56, yield: { atk: 2 } },
      { name: "Gengar", level: 58, yield: { spa: 3 } },
    ],
    false,
  ),
  trainer(
    "elite-four-lance",
    "してんのう ワタル",
    "Elite Four Lance",
    "ポケモンリーグ",
    "Pokémon League",
    [
      { name: "Gyarados", level: 56, yield: { atk: 2 } },
      { name: "Dragonair", level: 54, yield: { atk: 2 } },
      { name: "Dragonair", level: 54, yield: { atk: 2 } },
      { name: "Aerodactyl", level: 58, yield: { spe: 2 } },
      { name: "Dragonite", level: 60, yield: { atk: 3 } },
    ],
    false,
  ),
  trainer(
    "champion-rival",
    "チャンピオン ライバル",
    "Champion Rival",
    "ポケモンリーグ",
    "Pokémon League",
    [
      { name: "Pidgeot", level: 59, yield: { spe: 3 } },
      { name: "Alakazam", level: 57, yield: { spa: 3 } },
      { name: "Rhydon", level: 59, yield: { atk: 2 } },
    ],
    false,
  ),
];

// ── Gym Leaders ─────────────────────────────────────────────────

const gymLeaders: TrainerEntry[] = [
  trainer(
    "gym-leader-brock",
    "ジムリーダー タケシ",
    "Gym Leader Brock",
    "ニビシティジム",
    "Pewter City Gym",
    [
      { name: "Geodude", level: 12, yield: { def: 1 } },
      { name: "Onix", level: 14, yield: { def: 1 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-misty",
    "ジムリーダー カスミ",
    "Gym Leader Misty",
    "ハナダシティジム",
    "Cerulean City Gym",
    [
      { name: "Staryu", level: 18, yield: { spe: 1 } },
      { name: "Starmie", level: 21, yield: { spe: 2 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-surge",
    "ジムリーダー マチス",
    "Gym Leader Lt. Surge",
    "クチバシティジム",
    "Vermilion City Gym",
    [
      { name: "Voltorb", level: 21, yield: { spe: 1 } },
      { name: "Pikachu", level: 18, yield: { spe: 2 } },
      { name: "Raichu", level: 24, yield: { spe: 3 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-erika",
    "ジムリーダー エリカ",
    "Gym Leader Erika",
    "タマムシシティジム",
    "Celadon City Gym",
    [
      { name: "Victreebel", level: 29, yield: { atk: 3 } },
      { name: "Tangela", level: 24, yield: { def: 1 } },
      { name: "Vileplume", level: 29, yield: { spa: 3 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-koga",
    "ジムリーダー キョウ",
    "Gym Leader Koga",
    "セキチクシティジム",
    "Fuchsia City Gym",
    [
      { name: "Koffing", level: 37, yield: { def: 1 } },
      { name: "Muk", level: 39, yield: { hp: 1, atk: 1 } },
      { name: "Koffing", level: 37, yield: { def: 1 } },
      { name: "Weezing", level: 43, yield: { def: 2 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-sabrina",
    "ジムリーダー ナツメ",
    "Gym Leader Sabrina",
    "ヤマブキシティジム",
    "Saffron City Gym",
    [
      { name: "Kadabra", level: 38, yield: { spa: 2 } },
      { name: "Mr. Mime", level: 37, yield: { spd: 2 } },
      { name: "Venomoth", level: 38, yield: { spa: 1, spe: 1 } },
      { name: "Alakazam", level: 43, yield: { spa: 3 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-blaine",
    "ジムリーダー カツラ",
    "Gym Leader Blaine",
    "グレンジム",
    "Cinnabar Island Gym",
    [
      { name: "Growlithe", level: 42, yield: { atk: 1 } },
      { name: "Ponyta", level: 40, yield: { spe: 1 } },
      { name: "Rapidash", level: 42, yield: { spe: 2 } },
      { name: "Arcanine", level: 47, yield: { atk: 2 } },
    ],
    false,
  ),
  trainer(
    "gym-leader-giovanni",
    "ジムリーダー サカキ",
    "Gym Leader Giovanni",
    "トキワシティジム",
    "Viridian City Gym",
    [
      { name: "Rhyhorn", level: 45, yield: { def: 1 } },
      { name: "Dugtrio", level: 42, yield: { spe: 2 } },
      { name: "Nidoqueen", level: 44, yield: { hp: 3 } },
      { name: "Nidoking", level: 45, yield: { atk: 3 } },
      { name: "Rhydon", level: 50, yield: { atk: 2 } },
    ],
    false,
  ),
];

// ── All trainers combined ────────────────────────────────────────

export const frlgTrainers: TrainerEntry[] = [
  ...hpTrainers,
  ...atkTrainers,
  ...defTrainers,
  ...spaTrainers,
  ...spdTrainers,
  ...speTrainers,
  ...bossTrainers,
  ...gymLeaders,
];

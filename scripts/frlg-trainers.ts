/**
 * frlg-trainers.ts
 *
 * Trainer data for FRLG stat training.
 * Focuses on Vs. Seeker rematchable trainers commonly used for training.
 * Data sourced from Smogon FRLG Training Guide and Bulbapedia.
 *
 * Format follows SourceGroup from countstack preset schema.
 */

export interface LocalizedString {
  [lang: string]: string;
}

export interface TrainerPokemon {
  name: LocalizedString;
  level: number;
  values: Record<string, number>;
}

export interface TrainerEntry {
  id: string;
  name: LocalizedString;
  location: LocalizedString;
  members: TrainerPokemon[];
  totalValues: Record<string, number>;
  rematchable: boolean;
}

function sumValues(pokemon: TrainerPokemon[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const p of pokemon) {
    for (const [stat, value] of Object.entries(p.values)) {
      total[stat] = (total[stat] ?? 0) + value;
    }
  }
  return total;
}

function trainer(
  id: string,
  name: LocalizedString,
  location: LocalizedString,
  members: TrainerPokemon[],
  rematchable: boolean,
): TrainerEntry {
  return {
    id,
    name,
    location,
    members,
    totalValues: sumValues(members),
    rematchable,
  };
}

function pkmn(ja: string, en: string, level: number, v: Record<string, number>): TrainerPokemon {
  return { name: { ja, en }, level, values: v };
}

// ── HP Trainers ──────────────────────────────────────────────

const hpTrainers: TrainerEntry[] = [
  trainer(
    "tuber-f-route19",
    { ja: "うきわガール（19ばんすいどう）", en: "Tuber♀ (Route 19)" },
    { ja: "19ばんすいどう", en: "Route 19" },
    [
      pkmn("ヒトデマン", "Staryu", 17, { spe: 1 }),
      pkmn("ヒトデマン", "Staryu", 17, { spe: 1 }),
    ],
    true,
  ),
  trainer(
    "cooltrainer-f-route19",
    { ja: "エリートトレーナー♀（19ばんすいどう）", en: "Cooltrainer♀ (Route 19)" },
    { ja: "19ばんすいどう", en: "Route 19" },
    [
      pkmn("アズマオウ", "Seaking", 37, { atk: 2 }),
    ],
    true,
  ),
  trainer(
    "aroma-lady-route15",
    { ja: "アロマなおねえさん（15ばんどうろ）", en: "Aroma Lady (Route 15)" },
    { ja: "15ばんどうろ", en: "Route 15" },
    [
      pkmn("ラフレシア", "Vileplume", 37, { spa: 3 }),
    ],
    true,
  ),
];

// ── Attack Trainers ──────────────────────────────────────────

const atkTrainers: TrainerEntry[] = [
  trainer(
    "camper-route14",
    { ja: "キャンプボーイ（14ばんどうろ）", en: "Camper (Route 14)" },
    { ja: "14ばんどうろ", en: "Route 14" },
    [
      pkmn("ニドリーノ", "Nidorino", 38, { atk: 2 }),
    ],
    true,
  ),
  trainer(
    "blackbelt-route12",
    { ja: "カラテおう（12ばんどうろ）", en: "Black Belt (Route 12)" },
    { ja: "12ばんどうろ", en: "Route 12" },
    [
      pkmn("ゴーリキー", "Machoke", 36, { atk: 2 }),
      pkmn("ゴーリキー", "Machoke", 36, { atk: 2 }),
    ],
    true,
  ),
  trainer(
    "biker-route16",
    { ja: "ぼうそうぞく（16ばんどうろ）", en: "Biker (Route 16)" },
    { ja: "16ばんどうろ", en: "Route 16" },
    [
      pkmn("マタドガス", "Weezing", 38, { def: 2 }),
      pkmn("ベトベトン", "Muk", 38, { hp: 1, atk: 1 }),
    ],
    true,
  ),
];

// ── Defense Trainers ──────────────────────────────────────────

const defTrainers: TrainerEntry[] = [
  trainer(
    "picnicker-route14",
    { ja: "ピクニックガール（14ばんどうろ）", en: "Picnicker (Route 14)" },
    { ja: "14ばんどうろ", en: "Route 14" },
    [
      pkmn("ニドリーナ", "Nidorina", 38, { hp: 2 }),
    ],
    true,
  ),
  trainer(
    "hiker-rocktunel",
    { ja: "やまおとこ（イワヤマトンネル）", en: "Hiker (Rock Tunnel)" },
    { ja: "イワヤマトンネル", en: "Rock Tunnel" },
    [
      pkmn("イシツブテ", "Geodude", 25, { def: 1 }),
      pkmn("イシツブテ", "Geodude", 25, { def: 1 }),
      pkmn("ゴローン", "Graveler", 25, { def: 2 }),
    ],
    true,
  ),
  trainer(
    "youngster-route11",
    { ja: "たんパンこぞう（11ばんどうろ）", en: "Youngster (Route 11)" },
    { ja: "11ばんどうろ", en: "Route 11" },
    [
      pkmn("サンドパン", "Sandslash", 31, { def: 2 }),
    ],
    true,
  ),
];

// ── Special Attack Trainers ──────────────────────────────────

const spaTrainers: TrainerEntry[] = [
  trainer(
    "psychic-m-route10",
    { ja: "サイキッカー♂（10ばんどうろ）", en: "Psychic♂ (Route 10)" },
    { ja: "10ばんどうろ", en: "Route 10" },
    [
      pkmn("ヤドン", "Slowpoke", 33, { hp: 1 }),
      pkmn("ヤドン", "Slowpoke", 33, { hp: 1 }),
      pkmn("ヤドラン", "Slowbro", 33, { def: 2 }),
    ],
    true,
  ),
  trainer(
    "beauty-route19",
    { ja: "おとなのおねえさん（19ばんすいどう）", en: "Beauty (Route 19)" },
    { ja: "19ばんすいどう", en: "Route 19" },
    [
      pkmn("トサキント", "Goldeen", 35, { atk: 1 }),
      pkmn("アズマオウ", "Seaking", 35, { atk: 2 }),
    ],
    true,
  ),
  trainer(
    "aroma-lady2-route15",
    { ja: "アロマなおねえさん2（15ばんどうろ）", en: "Aroma Lady 2 (Route 15)" },
    { ja: "15ばんどうろ", en: "Route 15" },
    [
      pkmn("クサイハナ", "Gloom", 34, { spa: 2 }),
      pkmn("クサイハナ", "Gloom", 34, { spa: 2 }),
    ],
    true,
  ),
];

// ── Special Defense Trainers ──────────────────────────────────

const spdTrainers: TrainerEntry[] = [
  trainer(
    "gentleman-route12",
    { ja: "ジェントルマン（12ばんどうろ）", en: "Gentleman (Route 12)" },
    { ja: "12ばんどうろ", en: "Route 12" },
    [
      pkmn("カビゴン", "Snorlax", 38, { hp: 2 }),
    ],
    true,
  ),
  trainer(
    "fisherman-route12a",
    { ja: "つりびと（12ばんどうろ）", en: "Fisherman (Route 12)" },
    { ja: "12ばんどうろ", en: "Route 12" },
    [
      pkmn("コイキング", "Magikarp", 28, { spe: 1 }),
      pkmn("コイキング", "Magikarp", 28, { spe: 1 }),
      pkmn("コイキング", "Magikarp", 28, { spe: 1 }),
      pkmn("コイキング", "Magikarp", 28, { spe: 1 }),
      pkmn("ギャラドス", "Gyarados", 28, { atk: 2 }),
    ],
    true,
  ),
  trainer(
    "swimmer-f-route20",
    { ja: "かいパンやろう♀（20ばんすいどう）", en: "Swimmer♀ (Route 20)" },
    { ja: "20ばんすいどう", en: "Route 20" },
    [
      pkmn("メノクラゲ", "Tentacool", 35, { spd: 1 }),
      pkmn("ドククラゲ", "Tentacruel", 35, { spd: 2 }),
    ],
    true,
  ),
];

// ── Speed Trainers ──────────────────────────────────────────

const speTrainers: TrainerEntry[] = [
  trainer(
    "biker-route17a",
    { ja: "ぼうそうぞく（17ばんどうろ）A", en: "Biker A (Route 17)" },
    { ja: "17ばんどうろ", en: "Route 17" },
    [
      pkmn("ドードー", "Doduo", 28, { spe: 1 }),
      pkmn("ドードー", "Doduo", 28, { spe: 1 }),
      pkmn("ドードリオ", "Dodrio", 28, { spe: 2 }),
    ],
    true,
  ),
  trainer(
    "bird-keeper-route18",
    { ja: "とりつかい（18ばんどうろ）", en: "Bird Keeper (Route 18)" },
    { ja: "18ばんどうろ", en: "Route 18" },
    [
      pkmn("オニスズメ", "Spearow", 29, { spe: 1 }),
      pkmn("オニドリル", "Fearow", 29, { spe: 2 }),
    ],
    true,
  ),
  trainer(
    "biker-route17b",
    { ja: "ぼうそうぞく（17ばんどうろ）B", en: "Biker B (Route 17)" },
    { ja: "17ばんどうろ", en: "Route 17" },
    [
      pkmn("ビリリダマ", "Voltorb", 29, { spe: 1 }),
      pkmn("ビリリダマ", "Voltorb", 29, { spe: 1 }),
      pkmn("コイル", "Magnemite", 29, { spa: 1 }),
    ],
    true,
  ),
];

// ── Key Non-Rematchable Trainers (bosses, gym leaders, etc.) ────

const bossTrainers: TrainerEntry[] = [
  trainer(
    "elite-four-lorelei",
    { ja: "してんのう カンナ", en: "Elite Four Lorelei" },
    { ja: "ポケモンリーグ", en: "Pokémon League" },
    [
      pkmn("ジュゴン", "Dewgong", 52, { spd: 2 }),
      pkmn("パルシェン", "Cloyster", 51, { def: 2 }),
      pkmn("ヤドラン", "Slowbro", 52, { def: 2 }),
      pkmn("ルージュラ", "Jynx", 54, { spa: 2 }),
      pkmn("ラプラス", "Lapras", 54, { hp: 2 }),
    ],
    false,
  ),
  trainer(
    "elite-four-bruno",
    { ja: "してんのう シバ", en: "Elite Four Bruno" },
    { ja: "ポケモンリーグ", en: "Pokémon League" },
    [
      pkmn("イワーク", "Onix", 51, { def: 1 }),
      pkmn("エビワラー", "Hitmonchan", 53, { spd: 2 }),
      pkmn("サワムラー", "Hitmonlee", 53, { atk: 2 }),
      pkmn("イワーク", "Onix", 54, { def: 1 }),
      pkmn("カイリキー", "Machamp", 56, { atk: 3 }),
    ],
    false,
  ),
  trainer(
    "elite-four-agatha",
    { ja: "してんのう キクコ", en: "Elite Four Agatha" },
    { ja: "ポケモンリーグ", en: "Pokémon League" },
    [
      pkmn("ゲンガー", "Gengar", 54, { spa: 3 }),
      pkmn("ゴルバット", "Golbat", 54, { spe: 2 }),
      pkmn("ゴースト", "Haunter", 53, { spa: 2 }),
      pkmn("アーボック", "Arbok", 56, { atk: 2 }),
      pkmn("ゲンガー", "Gengar", 58, { spa: 3 }),
    ],
    false,
  ),
  trainer(
    "elite-four-lance",
    { ja: "してんのう ワタル", en: "Elite Four Lance" },
    { ja: "ポケモンリーグ", en: "Pokémon League" },
    [
      pkmn("ギャラドス", "Gyarados", 56, { atk: 2 }),
      pkmn("ハクリュー", "Dragonair", 54, { atk: 2 }),
      pkmn("ハクリュー", "Dragonair", 54, { atk: 2 }),
      pkmn("プテラ", "Aerodactyl", 58, { spe: 2 }),
      pkmn("カイリュー", "Dragonite", 60, { atk: 3 }),
    ],
    false,
  ),
  trainer(
    "champion-rival",
    { ja: "チャンピオン ライバル", en: "Champion Rival" },
    { ja: "ポケモンリーグ", en: "Pokémon League" },
    [
      pkmn("ピジョット", "Pidgeot", 59, { spe: 3 }),
      pkmn("フーディン", "Alakazam", 57, { spa: 3 }),
      pkmn("サイドン", "Rhydon", 59, { atk: 2 }),
    ],
    false,
  ),
];

// ── Gym Leaders ─────────────────────────────────────────────────

const gymLeaders: TrainerEntry[] = [
  trainer(
    "gym-leader-brock",
    { ja: "ジムリーダー タケシ", en: "Gym Leader Brock" },
    { ja: "ニビシティジム", en: "Pewter City Gym" },
    [
      pkmn("イシツブテ", "Geodude", 12, { def: 1 }),
      pkmn("イワーク", "Onix", 14, { def: 1 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-misty",
    { ja: "ジムリーダー カスミ", en: "Gym Leader Misty" },
    { ja: "ハナダシティジム", en: "Cerulean City Gym" },
    [
      pkmn("ヒトデマン", "Staryu", 18, { spe: 1 }),
      pkmn("スターミー", "Starmie", 21, { spe: 2 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-surge",
    { ja: "ジムリーダー マチス", en: "Gym Leader Lt. Surge" },
    { ja: "クチバシティジム", en: "Vermilion City Gym" },
    [
      pkmn("ビリリダマ", "Voltorb", 21, { spe: 1 }),
      pkmn("ピカチュウ", "Pikachu", 18, { spe: 2 }),
      pkmn("ライチュウ", "Raichu", 24, { spe: 3 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-erika",
    { ja: "ジムリーダー エリカ", en: "Gym Leader Erika" },
    { ja: "タマムシシティジム", en: "Celadon City Gym" },
    [
      pkmn("ウツボット", "Victreebel", 29, { atk: 3 }),
      pkmn("モンジャラ", "Tangela", 24, { def: 1 }),
      pkmn("ラフレシア", "Vileplume", 29, { spa: 3 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-koga",
    { ja: "ジムリーダー キョウ", en: "Gym Leader Koga" },
    { ja: "セキチクシティジム", en: "Fuchsia City Gym" },
    [
      pkmn("ドガース", "Koffing", 37, { def: 1 }),
      pkmn("ベトベトン", "Muk", 39, { hp: 1, atk: 1 }),
      pkmn("ドガース", "Koffing", 37, { def: 1 }),
      pkmn("マタドガス", "Weezing", 43, { def: 2 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-sabrina",
    { ja: "ジムリーダー ナツメ", en: "Gym Leader Sabrina" },
    { ja: "ヤマブキシティジム", en: "Saffron City Gym" },
    [
      pkmn("ユンゲラー", "Kadabra", 38, { spa: 2 }),
      pkmn("バリヤード", "Mr. Mime", 37, { spd: 2 }),
      pkmn("モルフォン", "Venomoth", 38, { spa: 1, spe: 1 }),
      pkmn("フーディン", "Alakazam", 43, { spa: 3 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-blaine",
    { ja: "ジムリーダー カツラ", en: "Gym Leader Blaine" },
    { ja: "グレンジム", en: "Cinnabar Island Gym" },
    [
      pkmn("ガーディ", "Growlithe", 42, { atk: 1 }),
      pkmn("ポニータ", "Ponyta", 40, { spe: 1 }),
      pkmn("ギャロップ", "Rapidash", 42, { spe: 2 }),
      pkmn("ウインディ", "Arcanine", 47, { atk: 2 }),
    ],
    false,
  ),
  trainer(
    "gym-leader-giovanni",
    { ja: "ジムリーダー サカキ", en: "Gym Leader Giovanni" },
    { ja: "トキワシティジム", en: "Viridian City Gym" },
    [
      pkmn("サイホーン", "Rhyhorn", 45, { def: 1 }),
      pkmn("ダグトリオ", "Dugtrio", 42, { spe: 2 }),
      pkmn("ニドクイン", "Nidoqueen", 44, { hp: 3 }),
      pkmn("ニドキング", "Nidoking", 45, { atk: 3 }),
      pkmn("サイドン", "Rhydon", 50, { atk: 2 }),
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

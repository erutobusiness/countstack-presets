# Contributing a Preset

Thank you for contributing a preset to countstack! This guide walks you through creating a new preset and submitting it as a pull request.

## Prerequisites

- A text editor
- Basic knowledge of JSON
- A GitHub account

No build tools or programming languages are required.

## Preset Structure

Each preset lives in its own directory (e.g., `my-game/preset.json`). The JSON file must follow the schema defined in `schema/preset.schema.json`.

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `meta` | object | Preset metadata (id, name, version, description) |
| `counters` | array | Counter definitions (at least one required) |
| `totalMax` | number | Maximum sum across all counters |
| `multipliers` | array | Battle multiplier definitions |
| `multiplierStacking` | `"multiplicative"` | How multipliers combine |
| `items` | array | Fixed-increment item definitions |
| `itemsAffectedByMultipliers` | boolean | Whether items are affected by multipliers |
| `manualSteps` | object | Manual increment/decrement step options |
| `database` | object | Contains `entries` and `groups` arrays |
| `goalTemplates` | array | Predefined goal configurations |
| `notes` | array | User-visible tips and notes (strings) |

### `meta`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID matching the directory name. Pattern: `^[a-z0-9][a-z0-9-]*$` |
| `name` | string | Display name (can be localized) |
| `version` | string | Semantic version (`x.y.z`) |
| `description` | string | Brief description |

### `counters[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique counter ID (e.g., `"hp"`, `"atk"`) |
| `name` | string | Display name |
| `shortName` | string | Abbreviated name (1-2 chars) |
| `max` | number | Maximum value for this counter |
| `recommended` | number | Recommended target value |
| `defaultDirection` | `"up"` or `"down"` | Default counting direction |
| `includeInTotal` | boolean | Whether to include in total sum |

### `multipliers[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique multiplier ID |
| `name` | string | Display name |
| `factor` | number | Multiplication factor |
| `scope` | `"battle"` | When the multiplier applies |

### `items[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique item ID |
| `name` | string | Display name |
| `counter` | string | Which counter this item affects (must match a `counters[].id`) |
| `amount` | number | How much the item adds |
| `maxPerStat` | number | Maximum total from this item type per stat |

### `manualSteps`

| Field | Type | Description |
|-------|------|-------------|
| `increments` | number[] | Available manual increment steps |
| `decrements` | number[] | Available manual decrement steps |

### `database.entries[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique entry ID |
| `catalogNumber` | number | Catalog/index number |
| `name` | string | Display name |
| `nameEn` | string | English name |
| `yield` | object | Counter yields (e.g., `{ "hp": 1, "atk": 2 }`) |
| `tags` | string[] | Tags for filtering |

### `database.groups[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique group ID |
| `name` | string | Display name |
| `nameEn` | string | English name |
| `location` | string | Location name |
| `locationEn` | string | English location name |
| `members` | array | Group members (each with `name`, `level`, `yield`) |
| `totalYield` | object | Combined yield of all members |
| `rematchable` | boolean | Whether this group can be re-encountered |

### `goalTemplates[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique template ID |
| `name` | string | Display name |
| `goals` | object | Target values by counter ID (e.g., `{ "atk": 252, "spe": 252 }`) |

## Minimal Example

```json
{
  "meta": {
    "id": "my-game",
    "name": "My Game Preset",
    "version": "1.0.0",
    "description": "A preset for My Game"
  },
  "counters": [
    {
      "id": "stat-a",
      "name": "Stat A",
      "shortName": "A",
      "max": 100,
      "recommended": 100,
      "defaultDirection": "up",
      "includeInTotal": true
    }
  ],
  "totalMax": 200,
  "multipliers": [],
  "multiplierStacking": "multiplicative",
  "items": [],
  "itemsAffectedByMultipliers": false,
  "manualSteps": {
    "increments": [1],
    "decrements": [1]
  },
  "database": {
    "entries": [
      {
        "id": "entry-1",
        "catalogNumber": 1,
        "name": "Entry One",
        "nameEn": "Entry One",
        "yield": { "stat-a": 1 },
        "tags": ["basic"]
      }
    ],
    "groups": []
  },
  "goalTemplates": [],
  "notes": []
}
```

## Updating registry.json

After creating your preset, add an entry to `registry.json` in the root of the repository:

```json
{
  "id": "my-game",
  "name": "My Game Preset",
  "nameEn": "My Game Preset",
  "description": "Description in original language",
  "descriptionEn": "Description in English",
  "version": "1.0.0",
  "size": 0,
  "counters": 1,
  "entryCount": 1,
  "groupCount": 0,
  "dataUrl": "https://erutobusiness.github.io/countstack-presets/my-game/preset.json",
  "iconUrl": "https://erutobusiness.github.io/countstack-presets/my-game/icon.png",
  "tags": ["tag1", "tag2"]
}
```

- Set `size` to the file size of `preset.json` in bytes (use `wc -c my-game/preset.json` or check your file manager)
- Set `counters` to the number of counters
- Set `entryCount` and `groupCount` to the number of database entries and groups
- `dataUrl` must follow the pattern: `https://erutobusiness.github.io/countstack-presets/<id>/preset.json`
- Update `updatedAt` to the current timestamp

## Submitting a Pull Request

1. **Fork** this repository
2. **Create a branch** named `preset/<your-preset-id>` (e.g., `preset/my-game`)
3. **Add your files**:
   - `<preset-id>/preset.json` — the preset data
   - Update `registry.json` — add your entry to the `presets` array
4. **Push** and open a pull request against `main`

The CI will automatically validate your preset against the JSON Schema and check cross-references.

## Local Validation

Before submitting, you can validate locally:

```bash
# Install validation dependencies
npm install --no-save ajv ajv-formats

# Run the validation script
node scripts/validate-pr.mjs
```

## Tips

- **ID naming**: Use lowercase letters, numbers, and hyphens. The ID must match the directory name. Examples: `frlg`, `emerald`, `sv-dlc1`.
- **Versioning**: Start at `1.0.0`. Use semantic versioning — increment the patch for data fixes, minor for new entries, major for structural changes.
- **Bilingual support**: Provide both localized (`name`) and English (`nameEn`) values for database entries and groups. This helps the app serve users in different languages.
- **Yield keys**: The keys in `yield` objects must match your `counters[].id` values.
- **Legacy field names**: New presets should use canonical field names (`items`, `database.entries`, `database.groups`, `catalogNumber`, `tags`). The validation script handles legacy names (`vitamins`, `database.pokemon`, `database.trainers`, `dexNumber`, `availability`) for backward compatibility, but they are not recommended for new submissions.

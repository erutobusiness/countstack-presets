[日本語](README.md)

# countstack-presets

Preset data for [**countstack**](https://countstack.erutobusiness.workers.dev/), a generic counter/tracker PWA.

**[-> Use the app](https://countstack.erutobusiness.workers.dev/)**

## What is countstack?

countstack is a versatile counter/tracker PWA that adapts to any counting task through presets (JSON). Load a preset and it becomes a specialized counter for Pokemon EV training, workout tracking, study logging, and more.

### Key Features

- **Preset system** — Define counters, databases, multipliers, and items in JSON for any use case
- **Event sourcing** — Every action is recorded. Unlimited Undo/Redo
- **Source search & auto-add** — Select a source from the database and values are automatically added
- **Multiplier stacking** — Combine multiple multipliers multiplicatively (2x2=4x)
- **Goal tracking & clip alerts** — Monitor per-counter and total caps
- **Fully offline** — PWA with no account required. All data stored locally
- **Dark mode** — Automatic light/dark theme switching
- **Japanese / English** — Full multilingual support
- **JSON / CSV export** — Export all your data for free

### Screenshots

<table>
  <tr>
    <td><img src="docs/screenshots/welcome-light.png" width="200" alt="Welcome screen"></td>
    <td><img src="docs/screenshots/counter-light.png" width="200" alt="Counter screen (light)"></td>
    <td><img src="docs/screenshots/counter-dark.png" width="200" alt="Counter screen (dark)"></td>
  </tr>
  <tr>
    <td align="center">Welcome</td>
    <td align="center">Counter (Light)</td>
    <td align="center">Counter (Dark)</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/database-light.png" width="200" alt="Database screen"></td>
    <td><img src="docs/screenshots/home-light.png" width="200" alt="Home screen"></td>
    <td></td>
  </tr>
  <tr>
    <td align="center">Database</td>
    <td align="center">Home</td>
    <td></td>
  </tr>
</table>

## Getting Started

1. Visit [countstack](https://countstack.erutobusiness.workers.dev/)
2. Choose a preset from "Choose a Preset"
3. Create a profile and start counting

As a PWA, you can add it to your home screen for a native app-like experience.

## Available Presets

| ID | Name | Counters | Entries | Description |
|----|------|:--------:|:-------:|-------------|
| `frlg` | Pokemon FRLG | 6 | 387 | Pokemon FireRed/LeafGreen EV training |
| `workout` | Workout Volume Tracker | 6 | 44 | Weekly training volume by muscle group |
| `study` | Study Tracker | 5 | 31 | Study sessions by subject |

## Creating a Preset

You can create your own preset and contribute it via Pull Request.

1. Create a directory under `presets/` (e.g., `presets/my-game/`)
2. Add a `preset.json` following the schema in `schema/preset.schema.json`
3. Add an entry to `registry.json`
4. Open a Pull Request

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide with field definitions, a minimal example, and validation instructions.

### Directory Structure

```
presets/
  frlg/preset.json         # Pokemon FRLG
  workout/preset.json      # Workout
  study/preset.json        # Study
schema/
  preset.schema.json       # JSON Schema for presets
  registry.schema.json     # JSON Schema for the registry
scripts/
  validate-pr.mjs          # CI validation script
  generate-pokemon-db.ts   # Pokemon data generation
  build-preset.ts          # Preset build helper
registry.json              # Preset registry (loaded by the app)
```

### Local Validation

```bash
npm install --no-save ajv ajv-formats
node scripts/validate-pr.mjs
```

## License

This repository and its data are provided as-is for use with countstack.

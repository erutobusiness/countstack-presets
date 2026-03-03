# countstack-presets

Game presets for [countstack](https://github.com/erutobusiness/countstack), a generic counter/tracker PWA.

Each preset defines counters, multipliers, items, a searchable database, and goal templates for a specific game or system. Presets are served via GitHub Pages and loaded by the app at runtime.

## Directory Structure

```
├── schema/
│   ├── preset.schema.json      # JSON Schema for preset files
│   └── registry.schema.json    # JSON Schema for the registry
├── scripts/
│   ├── validate-pr.mjs         # CI validation script
│   ├── generate-pokemon-db.ts  # Data generation (FRLG-specific)
│   └── build-preset.ts         # Preset build helper
├── frlg/
│   └── preset.json             # Pokémon FireRed/LeafGreen preset
├── registry.json               # Preset registry (loaded by the app)
└── CONTRIBUTING.md             # Contributor guide
```

## Adding a Preset

1. Create a directory named after your preset ID (e.g., `my-game/`)
2. Add a `preset.json` following the schema in `schema/preset.schema.json`
3. Add an entry to `registry.json`
4. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, field definitions, and a minimal example.

## For Developers

### Validation

```bash
npm install --no-save ajv ajv-formats
node scripts/validate-pr.mjs
```

This validates all presets against the JSON Schema, checks cross-references between presets and the registry, and handles legacy field name normalization.

### Data Generation Scripts

The `scripts/` directory contains TypeScript scripts for generating preset data from external sources. These require `tsx` to run:

```bash
npm install
npm run generate:pokemon    # Generate Pokémon database from PokeAPI cache
npm run generate:build      # Build final preset.json
```

## License

This repository and its data are provided as-is for use with countstack.

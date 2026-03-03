## Preset Details

- **Preset ID**: `<preset-id>`
- **Game/System**:
- **Counters**: (number)
- **Database entries**: (number)
- **Database groups**: (number)

## Description

<!-- Brief description of the preset and what it tracks -->

## Checklist

- [ ] `<preset-id>/preset.json` is valid JSON
- [ ] `meta.id` matches the directory name
- [ ] `meta.version` follows semver (`x.y.z`)
- [ ] All required fields are present (see `schema/preset.schema.json`)
- [ ] `items[].counter` references valid counter IDs
- [ ] `registry.json` entry added with correct `entryCount`, `groupCount`, and `version`
- [ ] `dataUrl` follows the pattern `https://erutobusiness.github.io/countstack-presets/<id>/preset.json`
- [ ] CI validation passes

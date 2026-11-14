# FixPlus — Day 1 + Day 2 (from final CRUD project)

This is a runnable partial Expo Router project, extracted from the latest FixPlus CRUD ZIP.

## Day 1
- `app/(tabs)/index.jsx` — Home screen
- Shared setup: `app/_layout.jsx`, `app/(tabs)/_layout.jsx`, `contexts/AppContext.jsx`,
  `constants/theme.js`, `components/ui.jsx`, `data/services.js`

## Day 2
- `app/(tabs)/services.jsx` — searchable and filterable Services directory
- `app/service-details.jsx` — service details page
- Shared components and local service dataset

The tab bar intentionally shows only Home and Services.
The repair entry, repair history, profile, and analytics screens are NOT included.
The Record a repair button is intentionally hidden until the later-day screens are added.

## Run
npm install
npx expo start -c

## Git
This ZIP does not contain `.git`. If you want to preserve existing commit history,
copy its source files into your EXISTING Git clone; do not replace the `.git` folder.

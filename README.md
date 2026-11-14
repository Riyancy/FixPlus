# FixPlus — React Native Project

FixPlus is an offline-first home repair and maintenance service app built with React Native, Expo and Expo Router. Its service directory is local; the app does not call public APIs or online databases.

## Six screens

1. **Home** — brand, quick service search, categories and popular services.
2. **Service Directory** — local search, category filters, and sorting by price or customer rating.
3. **Service Details** — service description, included work, price, real customer rating average and review comments.
4. **Book a Service** — contact/address fields, calendar selection by day, month and year, selectable visit times, validation, and a local booking confirmation.
5. **My Bookings** — booking search, request details, completion confirmation and rating form.
6. **Profile & Settings** — saved favourites and a light/dark toggle activated by tapping its icon.

The four main pages use bottom tabs. Service details and booking open as stack routes. The booking confirmation is an in-screen state, so the app retains exactly six screens.

## Booking and customer rating flow

A new service booking starts with **Pending** status. After the service has actually been delivered, the customer uses **Service received · Mark completed** on that booking. Only then does the 1–5-star rating form become available; a short comment is optional. Each completed booking can be rated once. Ratings are stored on this device and update the service's displayed average and count; written comments appear on that service's details page. Until a customer submits a rating, the service is shown as not rated rather than displaying a sample score.

This is an offline class-project demo, so it cannot independently verify service delivery or share ratings between different phones. The customer confirms receipt, and all bookings and reviews stay on the device.

## Local features

Service records are in `data/services.js`. Favourites, bookings, ratings and appearance preferences use AsyncStorage. Search, category filtering, sorting, calendar date selection, booking validation and customer reviews work without a backend. The app does not process payments or send requests to a real provider.

## Run the project

Use Node.js 22.13 or newer, then run:

```bash
npm install
npx expo start
```

Open the QR code with Expo Go. To run the web version, use:

```bash
npx expo start --web
```

## Checks

```bash
npx expo lint
npx expo-doctor
npx expo export --platform web
```

## Project structure

- `app/` — six screen routes and navigation layouts.
- `components/` — reusable screen wrappers, buttons, empty states and service cards.
- `contexts/AppContext.jsx` — theme, local bookings and rating aggregation.
- `constants/theme.js` — shared light-blue and dark palettes.
- `data/services.js` — the local service catalogue with no pre-filled ratings.
- `assets/` — app launcher and web icon assets.

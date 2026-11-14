# FixPlus — Organization Repair History (revised)

This version records organization maintenance history instead of scheduling bookings.

## Features
- Home, repair types, repair details, repair history, profile/settings
- Add/edit/delete records with organization, asset, exact repair, description, date, cost, paid amount, status, and notes
- User-entered cost and paid amount; no preset repair prices
- Paid/unpaid/partially paid status calculated from amounts
- Search, status filters, and total expenses
- Browser localStorage on web; AsyncStorage on mobile. Records are device-local, not shared across employees.

## Run
1. Extract the ZIP and open the **FixPlus** project folder in VS Code.
2. Run `npm install` and then `npx expo start -c`.
3. Press `w` for web or open Expo Go.
4. Open **Repair History → Add** and save a test record. Refresh to confirm persistence.

## GitHub
Copy the contents of the extracted FixPlus folder into the existing Git-tracked project, **not** a new Git repository. Keep `.git` untouched. Test before committing.

## Note
Static code checks have been performed. A full Expo browser runtime test could not be completed in the build environment.

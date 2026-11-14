# FixPlus — Organization Repair Register

Offline React Native Expo project for tracking organizational breakdowns and maintenance expenses. **No booking or customer rating workflow** is required.

## Screens
1. Organization dashboard (tab)
2. Services / maintenance directory (tab)
3. Repair History (tab)
4. Profile & cost dashboard (tab)
5. Service Details (detail screen)
6. Add/Edit Repair Record (form screen)

## Dataset and features
- 23 built-in local maintenance methods across Electrical, Plumbing, AC & Appliance, Cleaning, Carpentry, Mechanical, IT & Network, Building and Safety.
- User-generated repair records stored locally (web: localStorage, mobile: AsyncStorage).
- Record organization, equipment, exact breakdown, description, date, actual repair cost, paid amount, status, and notes.
- Search and filter history, edit and delete entries, save favourite methods.
- Profile shows overall repair count, total cost, outstanding balance, monthly cost, and costs by repair method.
- No public API, server, or online database. Data is device/browser-specific; clearing browser data deletes records.

## Run
```bash
npm install
npx expo start -c
```
Open the web preview or Expo Go. For the assignment, demonstrate that records remain after refreshing the same browser, search and filters work, and monthly totals update after editing records.

## Git
Use the existing Git repository; **do not overwrite its `.git` folder**. Test the project before committing changes.

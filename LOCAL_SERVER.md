# Previous local-server setup (optional)

Updated against the supplied Athar presentation (PDF filename mentions Rasid; the slides describe Athar).

This is a **local project prototype**, with a React/Vite frontend and an Express/SQLite record server. Existing fleet, diagnostic, prediction and device data are demonstration fixtures. There is no live fleet connection, trained AI model, payment subscription or external dispatch service.

## Run the complete website

Requires Node.js 22.13 or newer (Node 24 tested). Keep the whole extracted folder together.

With the project's original Bun package manager:

```sh
bun install --frozen-lockfile
bun run build
bun run start
```

Or with npm:

```sh
npm install --package-lock=false
npm run build
npm start
```

Open **http://localhost:3001**. The included `dist` folder is already built, so after installing dependencies you may run `npm start` directly.

For development, run `npm run server` in one terminal and `npm run dev` in another. Vite forwards `/api` to the record server.

**Do not open index.html directly or serve only the static frontend:** the new workflows need the record server. The server deliberately listens only on the local machine; it has no user accounts or tenant isolation and is not a public production deployment.

## Saved records

Records are stored in `data/athar.sqlite` (created at first run). Fleet records include contracts, inspections, reduced-size inspection photos, events and imported positions. Devices, notifications and work orders also persist. Display and language preferences remain in browser storage.

Wait for the saved indicator before closing the website. Saving failures appear in the interface; a fleet recovery download is available on a fleet/device/notification error. Concurrent writes from different windows are rejected rather than silently overwriting records. Reload after a conflict only after preserving any unsaved records. Back up the `data` directory with the server stopped. Set `ATHAR_DATA_DIR` to choose another location.

The first run seeds sample records. No database containing real customers is included in this ZIP. Do not remove the data folder to update the source code.

## Try the rental workflow

1. Open **Operations / العمليات**. Create a contract for an available vehicle using a unique contract ID, renter reference, start/return time and daily rate. Use a start time at or before the current time to test immediate handoff.
2. Select **Inspect & hand off** on the contract. Enter the inspector, verify odometer/fuel, record condition, codes, notes and up to four images. Saving starts the rental.
3. Expand **History & comparison** to add a dated mechanical observation during the rental. Optional OBD data import is under Diagnostics; GPS import is under Devices. Both provide downloadable JSON format examples. The examples contain sample values, not readings from your vehicle.
4. Select **Inspect & return**. Enter the actual return odometer and fuel; the app does not invent extra distance. Return moves the car into inspection review.
5. Review the contract's inspection pair, photos, new fault codes, condition changes and timeline. Download CSV or open a printable report and choose Save as PDF in the browser print dialog.
6. Approve availability or mark the car as requiring maintenance. A condition change is evidence for review, not automatic proof that the renter caused damage.

Vehicle creation/editing is under **Vehicles → Add or edit vehicle**. New cars start in inspection status. After a routine inspection, approve them from Operations. There are no actual diagnostic readings for a newly registered vehicle; empty/zero diagnostic placeholders must not be interpreted as measurements.

Work orders are saved internally under Diagnostics. Status changes persist, and new orders appear in the vehicle's maintenance list and timeline. Completing an order does not automatically clear diagnostic codes or claim that a workshop received anything.

## Import formats

GPS: an array (1–2,000 records, maximum 2 MB) of `vehicleId`, numeric `latitude`, numeric `longitude`, and ISO `timestamp` with timezone. Repeated points are deduplicated. The history offers coordinate links to OpenStreetMap; it is not an embedded live tracking map.

OBD: one JSON object (maximum 100 KB) with `vehicleId`, timezone-qualified `timestamp`, numeric `rpm`, `speed`, `coolantTemp`, `batteryVoltage`, `fuelLevel`, and `faultCodes` (an array such as `["P0301"]`). Use chronological readings. Imported codes are observations requiring technician interpretation. Repeated code sightings update occurrence counts; absence in a later reading does not automatically resolve a fault. A temperature above 115°C creates an **illustrative review alert**, not a validated manufacturer rule or prediction. No imported reading is labelled live.

Timestamp matching links imported events only when exactly one recorded rental interval matches. Events outside recorded intervals remain unassigned; historical missing contracts are not invented.

## Verification

```sh
npm run lint
node --import tsx --test tests/workflows.test.ts tests/server.test.ts
npm run build
```

Twelve automated checks cover the contract lifecycle, actual readings, routine-inspection status, missing/mismatched inspections, GPS validation/linkage/deduplication, OBD event recording, CSV output, SQLite restart persistence and conflicting writes. `server.test.ts` uses a temporary database and local port 3001; stop the app server before running that test.

See `FEATURE_AUDIT.md` for the presentation comparison, original gaps, implemented changes and remaining integration work. Browser visual and click-through testing was not performed in this environment.

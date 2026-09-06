# Athar: presentation-to-website feature audit

## Update: GitHub Pages edition

The user requested GitHub Pages deployment after this audit. The default build now uses **IndexedDB in each visitor's browser**, not the Express/SQLite server. Browser records include photos and survive reloads; separate visitors/devices do not share records. This change supersedes the local-server persistence and startup statements below for the default build. SQLite remains an optional local mode. The existing feature/integration limitations still apply.

Added a GitHub Actions deployment workflow, relative asset paths for repository URLs, a prebuilt `docs` publishing folder, and three automated browser-storage tests. Read the current README for deployment. Storage tests use a JavaScript IndexedDB implementation; they are not browser visual tests. The GitHub workflow has been prepared, not executed in a user's repository.


Reviewed against the supplied **Graduation Project Phase1 - Rasid (2).pdf** and the original Athar website ZIP. The PDF itself describes **أثر / Athar**. It contains 12 PDF pages numbered **2–13** on the slides; references below use those printed slide numbers. No cover slide or named team-member slide was supplied.

## Finding

The original website was an extensive frontend demonstration, not a working integrated rental platform. Its visual coverage was strongest in diagnostics, vehicle health, predictions and device administration. The presentation's central differentiator—an operational vehicle history tied to an actual rental contract—was not implemented as a complete workflow.

The revised project implements a **working local prototype** of that workflow and provides durable records and real report output. It does **not** turn sample fleet data into a real connected fleet. Live device collection, production authentication, external integrations and validated AI remain separate implementation work.

## Presentation analysis

| Printed slide | Meaning for the product | How it influenced the revision |
|---|---|---|
| 2 — Problem | Fragmented/manual operations, poor visibility during a rental, reactive maintenance and difficulty documenting responsibility. Market counts provide context, not proof of product adoption. | Unified contracts, condition records and events. Removed invented adoption and savings assertions. |
| 3 — Solution | Integrated rental platform, proactive monitoring, continuous timeline and return reports. | Implemented rental lifecycle, contract-scoped comparison and real exports. Added imported observations and an explicit temperature review rule; live monitoring remains unconnected. |
| 4 — Competitive value | Vehicle/contract/inspection/tracking/maintenance in one place, with records linked to contract and time. Simplicity and lower cost are goals. | Kept the existing navigation/design, integrated workflows, and avoided turning cost aspirations into quantified results. |
| 5 — Target customers | Small offices using Excel/manual processes, medium/large operators seeking consolidation; long-term rentals are future expansion. | Rewrote the homepage around small and medium rental offices and branch workflows. Did not invent large-fleet customers. |
| 6 — Market size | TAM/SAM/SOM illustration. | Treated as business context, not an application requirement or evidence of current customers. No new market-size claims were added. |
| 7 — Competitor matrix | Athar is marked for rental/contracts, digital inspections, real-time tracking, mechanical diagnostics, events during rental and linking mechanical condition to the contract. | Used all six rows as core audit requirements. Real-time tracking is explicitly still not fulfilled by the delivered local prototype. Competitor checkmarks were not independently verified or republished as facts. |
| 8 — Business model | Monthly subscription by fleet size; basic rental package, advanced inspection/tracking package, optional hardware/mechanical-record add-on; setup/integration/custom services. | Removed invented prices and annual discounts. Described these as planned packages. Did not implement a checkout for unapproved prices or pretend subscription services exist. |
| 9 — Marketing | Direct sales, pilots, referrals, partnerships and specialized digital marketing. | Reflected the pilot direction without claiming current partnerships, referrals, support teams or customers. These are business activities rather than missing UI buttons. |
| 10 — Achievements | Prototype development, conversations with rental offices and relevant entities, market/competitor analysis. | Grounded About Us in these supplied achievements. No team names, legal company identity, certifications or customer results were invented. |
| 11 — Prototype | The supplied slide is essentially a heading with no embedded walkthrough. | Audited the actual source rather than assuming behavior from this slide. |
| 12 — Roadmap | Develop product, launch pilot/build partnerships, expand in Saudi Arabia, integrate into national digital ecosystem. | Kept integrations and expansion in the future-tense roadmap. |
| 13 — Funding/partnership needs | Funding allocation and sought rental/pilot and technical integration partners. | Evidence that field/device validation and integrations are planned work; not evidence that these are already operational. |

## Feature-by-feature findings and changes

| Requirement or existing claim | Original implementation | Revised behavior | Remaining boundary |
|---|---|---|---|
| Rental and contract management | `rentalContext` in fixtures; no contract creation or lifecycle. | Create unique contract ID, renter name/reference, dates and daily rate. Draft → active at handoff → returned after return inspection; cancel draft. Search/filter contracts. Prevent a second open contract for a vehicle. | Operational contract record, not a legally issued/signed rental document or national-platform integration. |
| Vehicle management | Search/filter/detail over a seeded fleet. | Add/edit vehicle identity, plate, VIN, branch and mileage; duplicate plate/VIN checks. New vehicles require inspection and availability approval. | No imported commercial fleet database, bulk vehicle import or tenant separation. New diagnostic zeros are placeholders, not measurements. |
| Digital inspection | Condition dropdowns worked only in memory. Inspector hard-coded; photos absent; notes could claim no defects automatically. | Enter actual inspector, mileage, fuel, condition, codes, notes and up to four reduced-size photos. Save to SQLite-backed fleet records. Routine inspections leave rental state unchanged. | Photos are stored with records as a local prototype convenience, not in production object storage. |
| Return readings | Automatically added 320 km to the vehicle at return; nested condition mileage disagreed with record mileage. | Actual odometer input, rollback validation, consistent mileage fields and entered fuel. No synthetic distance increase. | Operator must verify readings; there is no automatic odometer source. |
| Before/after comparison | Claimed “Delta Audit”; inspection lists without a dependable contract-paired comparison. | Match handoff and return by the same contract, compare mileage, fuel, exterior/interior/tires/lights and new fault codes, show notes/photos/inspectors/timestamps. Missing inspection is explicitly missing. | Does not infer causation or automatically assign customer liability. Historical fixtures lacking a matching pair remain incomplete. |
| Vehicle availability after return | Inspection submission immediately made the car available, even if defects existed. | Return moves the vehicle to inspection review. Operator reviews records then approves availability or marks maintenance. | The reviewer makes the readiness decision; this is not an automated safety certification. |
| Continuous timeline tied to rental | Fixture timeline; newly added inspections did not store contract identity on timeline events. | New inspection events and mechanical observations carry contract ID and time. Imported positions/readings are assigned only to exactly one matching recorded rental interval. | Historic missing contracts or ambiguous intervals are not invented. The database is not a tamper-evident or immutable ledger. |
| Mechanical events during rental | Static fault arrays and static timeline data. No ingestion. | Manual mechanical observations plus validated timestamped OBD JSON import. New codes create faults/events; repeat sightings update counts. Readings retain source and do not become “live.” | File ingestion, not an automatic OBD/CAN connection. No manufacturer code dictionary or ECU coverage verification. |
| Proactive monitoring | Sample warnings and predictions; scan action was a timer claiming a successful device poll. | Imported coolant readings above the explicit illustrative threshold create a review alert. Scan messaging states no live transport is configured. Existing sample warning screens retained with a prototype notice. | This rule is not a validated manufacturer threshold or a trained prediction model. It runs on import, not in a background live stream. |
| Real-time location tracking | No actual position records, GPS input or working map workflow. | GPS JSON import with coordinate/time validation, deduplication, per-vehicle history, timestamps and coordinate links to OpenStreetMap. | **Real-time tracking remains missing.** No live GPS provider, embedded fleet map, route playback or geofencing. |
| Mechanical diagnosis | Rich views of seeded codes/readings and hard-coded advice. | Retained diagnostic views and added file-driven code/reading updates. Unknown imported codes are not falsely assigned to a known subsystem. | Not a physical scan, verified code interpretation or validated diagnosis. A technician must interpret readings. |
| Predictive AI / failure probabilities | Seeded probabilities, explanations and forecast windows. No trained model or inference pipeline. | Explicit prototype notice; homepage no longer promises proven predictive performance. Removed settings claiming active OEM/AI learning controls. | **Validated predictive AI remains missing.** Requires a defined model, training/evaluation evidence and inference backend. |
| Maintenance operations | Work orders existed in view-local state, reset when the view was remounted; “dispatch” claimed an external action. | Persist work orders. New orders also appear in vehicle maintenance records and timeline. Completion updates the linked maintenance item and logs an event; maintenance vehicles return to inspection when no other open order remains. | Statuses are internal. No actual workshop booking, messaging or dispatch. Completion does not automatically clear fault codes. Legacy fixture work orders may not have matching maintenance IDs. |
| Device inventory/assignment | In-memory registration/pairing; reassignment could leave contradictory vehicle/device links. Ping fabricated online status and latency. | Saved inventory, clear prior assignment links, synchronize associated vehicle device status, reject duplicate registrations. New devices start offline. Ping preserves status and reports no transport. | No real device provisioning, heartbeat, tamper detection or telecom integration. Existing seeded device readings remain examples. |
| Report export | A timeout showed success without creating a download. | UTF-8 CSV downloads with quoting and formula protection. Browser-printable report opened for Print / Save PDF. Categories use current records; individual contract export includes comparison and events. | CSV is labelled CSV compatible with Excel, not native XLSX. PDF requires the browser's Save as PDF action. No scheduled report delivery. |
| Saved records | Fleet/inspection/device/notification changes were transient React state. | Express/SQLite server, serialized saves, revision checks against stale writes, error/saving indicators and unload protection. Fleet recovery download on storage error. Work orders persist separately. | Local single-operator prototype. No account/role permissions, multi-tenant service, cross-collection transactions or production audit controls. |
| Arabic/English, RTL, light/dark, accessibility preferences | Existing working display features mixed with unsupported “smart” settings. | Preserved display preferences and added bilingual homepage, forms, inspection/contract interfaces and native inspection dialog. | Existing older diagnostic text is not fully retranslated or accessibility-certified. Browser/mobile/keyboard testing was not performed. |
| SMS / WhatsApp / support | Homepage promised messaging and 24/7 services with no implementation. | Removed unsupported homepage promises and stated external messaging is not connected. | Real provider accounts, recipient handling and message delivery need a separate integration. |
| Subscription pricing / discounts | Invented monthly/yearly figures and package claims; all CTAs opened the same demo. | Planned package structure from slide 8, clearly unpriced; one honest prototype entry. | No billing, paid entitlements or confirmed commercial packages. |
| ROI and customer claims | Formula assumed prevented incidents and savings; claimed a real connected fleet and adoption by major companies. | Removed ROI calculator, fabricated savings/discounts/customer claims and “real fleet” copy. | Real savings need pilot measurements. |
| Emergency shutdown / automatic OEM calibration | Settings suggested active adaptive learning and immediate operational safeguards without underlying implementation. | Removed these unsupported controls; retained real display preferences and a concise capability statement. | No remote vehicle control or OEM integration. |

## Homepage rewrite

Replaced all homepage copy rather than lightly editing its marketing language:

- Title: **Athar | Rental Management & Vehicle History**.
- Hero: **Every rental, connected to its vehicle’s history.** / **كل عقد تأجير، مرتبط بسجل مركبته.**
- About Us: the Athar team developing the prototype, conversations with rental offices, market analysis, and the intended branch workflow.
- Features: contracts, inspections, contract-linked record, maintenance, imported data and return reports, with integration boundaries stated where they matter.
- Workflow: prepare the contract → follow the rental record → inspect and review the return.
- Stage and roadmap: prototype, real-fleet pilot, device/integration testing and later expansion.
- Planned packages: basic rental operations, advanced inspection/tracking and optional device/mechanical history add-on, without invented prices.
- Navbar, calls to action, footer, browser title, search/social descriptions and metadata now reflect the project. Existing supplied logos and app theme were preserved.

The supplied presentation does not name individual team members. “The Athar team / فريق أثر” is used instead of fabricated founder biographies.

## Verification evidence

Completed:

1. TypeScript check (`npm run lint`).
2. Production Vite build.
3. Twelve automated tests covering contract start/return, open-contract rejection, date validation, routine status preservation, odometer/fuel validation, contract-specific comparison, actual differences, GPS validation/deduplication/linkage, OBD event/threshold processing, CSV escaping and SQLite restart persistence/stale-write protection.
4. All 12 supplied PDF pages were extracted and their rendered slides reviewed, including the image-only competitor and market diagrams.

Not performed: browser click-through/visual testing, physical OBD/GPS tests, external service delivery, multi-user load testing or security certification. A successful build and domain test suite are not evidence that the remaining integrations work.

## What is still needed before a real pilot

- Real GPS/OBD transport specification, devices and authorized sample payloads; ingestion, heartbeat/freshness, retry and offline handling.
- Authentication, access roles, operator/tenant separation and production hosting/database/object-storage design.
- Vehicle-specific diagnostic interpretation and validated alert rules; model design/evaluation if predictive AI is retained as a product claim.
- Actual external-system and national-platform integration requirements and access.
- Commercial approval for prices/packages and a billing provider if subscriptions are to be activated.
- Browser usability/accessibility testing, field testing, data governance and operational acceptance on a real pilot fleet.

These are explicit unfinished capabilities, not presented as completed by changing labels or fabricating successful responses. The delivered source is a runnable local prototype with the added workflows, not a claim of production readiness.

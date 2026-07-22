# Worklog

- Bootstrapped Vite, strict TypeScript, Babylon.js, Havok, Vitest, and Playwright.
- Added a physical capsule and static test-chamber collider bodies.
- Added review telemetry and three tunable movement profiles.
- Corrected inverted pointer-delta signs at the mouse-look input boundary; positive horizontal deltas now turn right and positive vertical deltas look down, matching the Babylon camera rig.
- Added typed profile-specific look and head-bob response rates so responsive camera movement is immediate, grounded is restrained, and cinematic is deliberately smoothed.
- Added unit and Playwright coverage for four-direction mouse look, pitch clamping, profile URL selection, invalid-profile fallback, and measurable profile telemetry.

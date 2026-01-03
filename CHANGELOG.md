# Changelog

All notable changes to the "Quest Command" project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-03

### Added
-   **Core Dashboard:** Gamified task management interface with cyberpunk aesthetics.
-   **Authentication:** Supabase Auth integration with custom Login and Sign-up pages.
-   **PWA Support:** Full Progressive Web App capabilities including manifest, service worker, and offline support.
-   **Quest Management:**
    -   Create, update, delete quests.
    -   Real-time synchronization using Supabase Realtime.
    -   Optimistic UI updates for instant feedback.
    -   "Boss Fight" mode for urgent tasks (< 24h).
    -   Recurring quests (Daily, Weekly, Monthly).
-   **UI/UX:**
    -   Dark mode cyberpunk theme with neon accents.
    -   Static/stable authentications pages for better mobile performance.
    -   Custom "QC" branding icons (SVG).
    -   Toast notifications for user feedback.
-   **Documentation:**
    -   README.md with setup instructions.
    -   Contribution guidelines and Code of Conduct.

### Fixed
-   Resolved hydration mismatch in countdown timer by moving calculation to client-side.
-   Fixed "Quest Disappearing" bug during offline-to-online sync.
-   Fixed invisible quest cards in grid animations.
-   Removed all template/placeholder files from v0.dev.

### Changed
-   Renamed project package from `my-v0-project` to `quest-command`.
-   Updated build metadata to remove generator references.

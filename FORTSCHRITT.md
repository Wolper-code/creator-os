# Creator OS – Projektstand & Anleitung (v2)

## Aktueller Fortschritt
- **Grundstruktur & PWA:** `index.html` (mit direktem SVG-Tab-Icon), `style.css`, `app.js`, `manifest.json`, `icon.svg`, `sw.js` (Offline-Cache `creator-os-v3`)
- **7 Module im Ordner `modules/`:**
  1. `onboarding.js` – Creator-Name & Hauptplattform festlegen (+50 XP)
  2. `dashboard.js` – Gesamtübersicht mit Level, Badges, XP-Balken, Quest-Fortschritt & Schnellzugriff
  3. `platforms.js` – Sub-Dashboards für YouTube, TikTok, Twitch & Instagram (+15 XP pro Aktivierung)
  4. `monetization.js` – 5 Monetarisierungssäulen mit Notizen/Partner-Links (+20 XP pro Aktivierung)
  5. `quests.js` – Tägliche Creator-Quests mit automatischem Datums-Reset, manuellem Reset & eigenen Quests (+10 XP)
  6. `leaderboard.js` – Rangliste mit Level-Fortschritt und Platzierungen
  7. `parents.js` – Eltern-Dashboard mit 4-stelliger Eltern-PIN (Standard: `1234`), Sicherheitsfiltern, JSON-Backup (Export/Import) und Reset-Funktion

## Speicherung & Backup
- Alle Daten werden automatisch lokal im Browser (`localStorage` unter `creator_os_state_v1`) gespeichert.
- Über **Eltern-Dashboard -> Backup herunterladen** kann der aktuelle Spielstand jederzeit als `creator-os-backup.json` gesichert und wieder eingelesen werden.

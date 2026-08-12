# Skill Observations Log

Append-only. Newest entries at the bottom.

## 2026-08-12 — Preserve ops across catalogue sanitization

- **Trigger:** Live menu save wiped orders/table status on every catalogue edit.
- **Insight:** Catalogue sanitizers must not project “public guest shape” onto admin writes; strip ops only for public reads or an explicit resetOps flag.
- **Reusable pattern:** Split sanitize modes: default preserve operational fields with length/shape limits; `{ public:true }` for guest payloads; `{ resetOps:true }` for deliberate wipes.
- **Anti-pattern:** Unconditional `orders=[]` / `status:\"open\"` inside a shared sanitize used by both admin POST and public GET.

## 2026-08-12 — Admin-editable public venue config

- **Trigger:** Public contact/wifi/legal lived only in env; admin Settings deep-linked ops readiness but had no editors.
- **Insight:** Prefer extending an existing public GET endpoint with admin-auth POST + a dedicated store key over a second API file, so guests keep one URL and menu CRUD stays untouched.
- **Reusable pattern:** `stored non-empty overrides > env defaults`; accept historical env aliases (e.g. PUBLIC_BOOKING_EMAIL → contact email); keep sanitize/write helpers in `_store.js` next to other persistence keys.
- **Anti-pattern:** Stuffing public venue fields into menu `settings` (risks validate/sanitize side effects) or requiring a deploy to change guest-facing phone/Wi-Fi.

## 2026-08-12 — Admin edit/add remaining gaps
- Concurrent agents editing same files: re-read before patch; prefer atomic Python multi-replaces over stale StrReplace.
- `loadRemoteMenu` racing unlock vs first edit: if `dirtySincePublish`, always prefer local catalogue or edits vanish from API.
- Silent `saveLiveMenu({silent:true})` + success toast from UI = owner thinks guests see edits; always toast publish failures.
- Localhost PIN `1234` with real `ADMIN_PIN` set → login OK, POST `wrong_pin`; gate 1234 on `!adminPinSet`.

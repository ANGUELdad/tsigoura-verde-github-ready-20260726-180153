# Tsigoura Verde e-menu — product roadmap

## Product promise

Guests understand the menu in seconds, feel the character of the restaurant,
and never get stuck. The owner can change anything important during service
without technical knowledge or fear of breaking the live menu.

## How this product wins

Large restaurant platforms compete with broad suites: payments, loyalty,
marketing, POS integrations, and generic analytics. Tsigoura Verde should not
copy every module. It should be better at the experience that happens after a
guest scans the table QR:

1. **Fastest path to a confident choice** — immediate language selection,
   readable categories, strong search, clear prices, availability, allergens,
   and real dish visuals.
2. **A restaurant experience, not a software template** — premium typography,
   calm Greek hospitality, authentic menu art, and restrained motion.
3. **Owner confidence during a busy shift** — one-tap availability, undo,
   automatic empty-category hiding, safe deletion, preview, and an obvious
   live/local publishing state.
4. **Graceful failure** — the menu remains readable if an image, database, or
   optional service is unavailable.

## Release sequence

### Release 1 — confidence foundation

- Recoverable owner edits with one-tap undo.
- Category deletion, including an explicit confirmed option for its dishes.
- Empty categories disappear automatically for guests and are labelled as
  automatically hidden in the owner panel.
- Every dish visual has an instant vector fallback while loading or after an
  image failure.
- Open guest phones check for live menu revisions and refresh without
  interrupting an active sheet or cart interaction.

### Release 2 — owner command centre

- [x] Service checklist: database, PIN, public details, Wi-Fi, image uploads, and
  legal data in one place.
- [x] Menu health: missing translations, missing descriptions, media coverage,
  zero-price items, hidden items, and stale announcements.
- [x] Scheduled dish availability, using local calendar dates and automatic
  refresh on phones that remain open overnight.
- [x] Reusable, undoable event presets instead of manually hiding many dishes.
- [x] Automatic 14-day local/live backups, a visible change log, PIN-protected
  full restore, and undo after restoration.

### Release 3 — guest conversion

- Curated “recommended tonight” and pairing blocks controlled by the owner.
- [x] Owner-controlled vegetarian, spicy, and chef-pick metadata.
- [x] Dietary quick filters plus allergen exclusions that unlock only after
  every visible dish has an explicit restaurant review.
- Faster first load through generated image sizes and cache tuning.
- Post-meal feedback and a tasteful Google review prompt.
- Privacy-respecting scan, search, category, and dish-interest analytics.

### Release 4 — operations, only if the restaurant needs it

- Kitchen display with acknowledged order states.
- Waiter notifications and table sessions.
- Payment or POS integration through a proven provider.
- Loyalty and customer marketing with explicit consent.

## Success measures

- Median time from scan to first category interaction.
- Search success rate and empty-result rate.
- Percentage of guests who change language successfully.
- Number of owner corrections or support requests per service.
- Percentage of menu edits that reach the live store successfully.
- Broken-media events and fallback usage.
- Guest feedback score and review conversion.

## Guardrails

- No account is required to read the menu.
- No dark patterns, forced app install, autoplay, or unnecessary cookie banner.
- Allergens are always backed by an instruction to speak with staff.
- Ordering and payments stay disabled until the real service workflow is
  tested with staff.
- New features must make the guest or owner journey simpler, not merely make
  the dashboard look more advanced.

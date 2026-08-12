/* ============================================================================
   TSIGOURA VERDE — published menu
   ----------------------------------------------------------------------------
   This file IS the live menu when no KV store is attached. Generate it from:
       /admin  →  Ρυθμίσεις  →  "Κατέβασμα menu-live.js"
   Replace this file in the project, redeploy, and every phone shows the change.

   Guest load order (index.html):
       1. GET /api/menu   — shared KV store (admin edits appear immediately)
       2. This file       — window.TV_MENU_STATE (zero-setup publish path)
       3. tsigoura-data.js — built-in catalogue

   While TV_MENU_STATE is null the built-in catalogue is used only after /api/menu
   fails or is empty. Do not rely on browser cache for this file — deploy headers
   force no-store, and the guest page prefers /api/menu with cache busting.
   ========================================================================== */
window.TV_MENU_STATE = null;
window.TV_MENU_PUBLISHED_AT = '';

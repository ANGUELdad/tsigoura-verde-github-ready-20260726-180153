# Tsigoura Verde Resort — e-menu (deploy package)

Ready to upload to **Vercel**. No build step. The menu works as a static site; booking email and admin PIN checks use optional Vercel functions in `api/`.

## What's inside
| File | URL | What it is |
|---|---|---|
| `index.html` | `/` | Customer menu (the QR opens this) |
| `admin.html` | `/admin` | Owner panel (menu, tables, orders, QR, **Πιάτο ημέρας**) |
| `book.html` | `/book` | Full page for table bookings |
| `tsigoura-data.js` | — | All menu data (dishes, prices, categories, tables, settings) |
| `tsigoura-menu-icons.js`, `tsigoura-icons.js`, `tsigoura-qr.js` | — | Icons + QR encoder |
| `media/` | — | Logo, acorn mark, hero photo |
| `api/book.js` | `/api/book` | Booking email endpoint via Resend |
| `api/admin-login.js` | `/api/admin-login` | Admin PIN check from Vercel env |
| `api/public-config.js` | `/api/public-config` | Public contact/Wi-Fi/legal config from env |
| `menu-live.js` | — | **The published menu.** Generated from /admin |
| `.env.example` | — | Environment variable template |
| `vercel.json` | — | Clean URLs + cache headers |

## Deploy (2 minutes)
1. Install once: `npm i -g vercel`
2. From this folder: `vercel` (first run links/creates the project) → then `vercel --prod`
   *Or* drag this folder into the Vercel dashboard → New Project → Deploy.
3. You get `https://<project>.vercel.app`.

## Environment variables
Add these in Vercel: **Project → Settings → Environment Variables**. Use `.env.example` as the complete checklist.

- `RESEND_API_KEY` — your Resend API key
- `BOOKING_TO_EMAIL` or `BOOKING_EMAIL` — where booking requests should arrive
- `BOOKING_FROM_EMAIL` or `RESEND_FROM_EMAIL` — verified sender, e.g. `Tsigoura Verde Resort <bookings@yourdomain.gr>`
- `ADMIN_PIN` — the real admin/waiter PIN
- `PUBLIC_PHONE`, `PUBLIC_BOOKING_EMAIL`, `PUBLIC_INSTAGRAM`, `PUBLIC_FACEBOOK`, `PUBLIC_MAPS_URL`, `PUBLIC_WEBSITE_URL`
- `PUBLIC_WIFI_SSID`, `PUBLIC_WIFI_PASS`, `PUBLIC_WIFI_ENC`
- `PUBLIC_COMPANY_NAME`, `PUBLIC_AFM`, `PUBLIC_DOY`, `PUBLIC_GEMI`, `PUBLIC_ADDRESS`, `PUBLIC_MHTE`, `PUBLIC_AGORANOMIKOS`

If Resend is not configured yet, `/book` falls back to a prefilled email draft so customers are not trapped on a dead form.

## Live menu database (no keys to copy)

Admin changes reach every phone **immediately, with no redeploy**. Setup is three
clicks and you never handle a secret:

1. Vercel → your project → **Storage** tab
2. **Create Database** → choose **KV** → attach it to this project
3. **Redeploy** once

Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically — there is
nothing to copy or paste.

Then set **`ADMIN_PIN`** in *Settings → Environment Variables*. This one is
required: without it live saving is blocked, otherwise anyone who found the URL
could rewrite your menu.

Open **`/api/status`** at any time — it tells you exactly what is still missing.

### How it behaves
| | What customers get |
|---|---|
| KV attached + `ADMIN_PIN` set | Every admin edit is live on the next page load |
| No KV attached | The published `menu-live.js` file, else the built-in catalogue |

The badge in the admin header always says which mode you are in:

| Badge | Meaning |
|---|---|
| **Ζωντανά σε όλες τις συσκευές** (green) | Saving to the database. Customers see changes immediately. |
| **⚠ Λείπει ADMIN_PIN** (red) | Database is connected but writes are blocked. Set `ADMIN_PIN`. |
| **⚠ Χωρίς βάση · μόνο τοπικά** (amber) | No database. Publish with *Κατέβασμα menu-live.js* instead. |

### Fallback: publishing by file (works with zero setup)
If you never attach a database, you can still publish:
**/admin → Ρυθμίσεις → «Κατέβασμα menu-live.js»** → replace `menu-live.js` in the
project → redeploy. Slower, but needs no account and no configuration.

### Menu resolution order
1. `/api/menu` — the live database
2. `menu-live.js` — the published file
3. `tsigoura-data.js` — the built-in catalogue

If the database is unreachable the menu silently falls back, so guests never see
a blank page.

## Booking page
Share this link anywhere:

`https://<project>.vercel.app/book`

The menu header booking button opens this full page. The page posts to `/api/book`, and includes a spam honeypot plus required-field validation.

## The QR codes (two kinds — don't mix them)
- **Table QR** (print one per table): `https://<project>.vercel.app/?t=T4` → opens the menu already tagged to table T4. Generate/print these from **/admin → QR & Σύνδεσμοι**.
- **Order QR** (on the customer's screen after ordering): shows the order so the waiter can read/scan it. In this version it carries the order text; the waiter assigns the table if no `?t=` was used.

## Πιάτο ημέρας (today's special)
Owner sets it in **/admin → Επισκόπηση** (name + price + toggle). It appears as a highlighted banner at the top of the customer menu and can be ordered like any dish. Turn the toggle off to hide it.

## Wi-Fi
Guests tap the Wi-Fi icon in the menu header → a **join QR** (camera auto-connects) **plus** a copy-password button.

## Important notes
- This package ships in **traditional e-menu mode by default** for today's upload: guests see menu, availability, event banner, booking, socials, Wi-Fi, and legal info. The ordering systems can be re-enabled from `/admin → Ρυθμίσεις`.
- Menu edits live in `menu-live.js`. Until you publish it, admin changes stay on the device that made them.
- Set the real business/legal details, phone, Wi-Fi, booking email, and admin PIN in Vercel env before going public.
- Local preview fallback admin PIN is `1234`; production should use `ADMIN_PIN`.

# noel

A storefront for clothing and shoes. The shop window still reads from `src/data/products.ts` until Supabase is connected. After that, accounts, stock, orders, Moolre payments, Resend email, and Taysend SMS use the keys in `.env.example`.

The shop name lives in one file, so renaming the project is a single edit.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

If that port is already taken:

```bash
npx next dev -p 3001
```

## Where to edit

| What you want to change | File |
| --- | --- |
| Site name and short description | `src/data/site.ts` |
| Menu labels and categories | `src/data/menu.ts` |
| Products, prices, and image paths | `src/data/products.ts` |
| Currency symbol | `src/lib/currency.ts` |
| Photos | `public/images/` |

Prices in `src/data/products.ts` are plain numbers of Ghana cedis. `formatPrice` turns `450` into `GH₵ 450.00`.

## Accounts, stock, and orders

Copy `.env.example` to `.env.local` and fill in the Supabase URL, anon key, and service role key. Run `supabase/migrations/001_shop.sql` in the Supabase SQL editor, then:

```bash
npm run seed
```

That copies the file catalog into the database and leaves any stock counts you have already changed. Register with a Ghana phone number. Set `ADMIN_EMAIL` to that address and sign in at `/admin/login` to edit price, stock, and whether a piece is hidden. A size with stock of zero cannot be added to the cart.

Checkout at `/checkout` saves an unpaid order. The customer can open it from My orders. Stock does not change until Moolre sends a successful callback to `/api/payments/moolre`.

Set the Moolre callback URL to `https://YOUR-DOMAIN/api/payments/moolre`. Sandbox requests use `https://sandbox.moolre.com`. Add `MOOLRE_API_USER`, `MOOLRE_PUBLIC_KEY`, and `MOOLRE_WEBHOOK_SECRET`. A repeated success callback does not reduce stock twice. After the order is paid, Resend emails the order and Taysend sends one SMS. A missed message is written to `notify_log` and does not undo the payment.

## Images

```text
public/images/hero/       homepage carousel
public/images/banners/    wide photo on each department page
public/images/products/   product tiles, including a second photo for hover
```

Replace a file and keep the same name, or change the path in `src/data/products.ts`. These photos are placeholders.

## Folder structure

```text
src/app/            pages: home, /sneakers, /clothing
src/components/     navigation, hero, product cards, footer
src/data/           words, menu, and products
src/styles/         colours, type, and motion (globals.css)
public/images/      pictures
```

## What was removed from the template

The visual styles stayed. These parts were left out because they are not the shop window:

- Database, ORM, and migration scripts
- API routes, authentication, Stripe, and email
- Cart, checkout, orders, wishlist, and admin
- Analytics, tests, CI config, and the template docs

The license of the original template is MIT. A copy of this starter should keep that license notice if you ship substantial parts of the original code. See the template's `LICENSE` file.

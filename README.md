# noel

A storefront starter that keeps the look of the ecommerce template: condensed headlines, pill controls, photo tiles, and the same light and dark themes. The database, login, cart, and payments are not included.

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

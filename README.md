# The Course Is Over: Shopify theme

The storefront for *The Course Is Over: A Bet on AI, Training, and How People Learn at Work* by Matthew Estes.

This is a Shopify Online Store 2.0 theme. It uses the Matchlight palette (Ink, Bone, Ember) with Geist, Geist Mono and Instrument Serif. The fonts are self-hosted in `assets/`.

## Connect it to Shopify

1. In Shopify admin, go to **Online Store > Themes**.
2. Click **Add theme > Connect from GitHub**, then pick `me5231979/the-course-is-over` and the `main` branch.
3. Click **Customize** on the new theme. When it looks right, click **Publish**.

Shopify and GitHub stay in sync both ways. A push to `main` updates the theme, and edits made in the theme editor get committed back here.

## Set up the book

1. **Products > Add product**: name it *The Course Is Over*.
2. Add an option called **Format** with values like Paperback, Hardcover, eBook, Audiobook. Give each one a price.
3. For a format that isn't ready yet, set its inventory to 0 and turn off "Continue selling when out of stock". It shows as *Coming soon* and can't be bought.
4. Turn off "This is a physical product" (shipping) for the eBook and Audiobook variants. Deliver them with an app such as Shopify's free **Digital Downloads**.
5. In **Customize > Theme settings > Book**, choose the product and upload the cover. Until a cover is uploaded, the site shows a typographic cover.

## Pages and menus to create

- **Pages > Contact**: use the `page.contact` template. The home page links its bulk-order, speaking and "let's talk" buttons to `/pages/contact`.
- **Navigation > Main menu**: The idea (`/#ideas`), Author (`/#author`), FAQ (`/#faq`), Contact.
- **Navigation > Footer**: the same links, plus your policy pages.

Launch-list signups come in as customers tagged `newsletter, launch-list`, so they can be emailed with Shopify Email.

## Pre-launch

Leave **Online Store > Preferences > Password protection** on until launch. The password page shows the cover and its own email signup.

## Structure

| Folder | What's in it |
|---|---|
| `sections/` | Home page sections: `book-hero`, `statement`, `ideas`, `pull-quote`, `buy-book`, `author`, `invitation`, `faq`, `newsletter`, plus the product, cart, page and account sections |
| `snippets/` | `book-cover` (CSS cover fallback), `buy-form` (format picker and add to cart), meta tags, color variables |
| `templates/` | JSON templates. `index.json` holds the home page copy |
| `config/` | Theme settings: book, colors, social links |

All copy can be edited in the theme editor, so no code changes are needed.

## Check before pushing

```bash
npx @shopify/theme-check-node .   # or: shopify theme check
```

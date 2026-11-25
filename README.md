# The Course Is Over — book site

Marketing and sales site for *The Course Is Over: A Bet on AI, Training, and How People Learn at Work* by Matthew Estes.

- `site/`: the website (plain HTML, CSS and JS with no build step). Deploy this folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
- `docs/campaign-plan.md`: the launch campaign brief ("Take the Bet").

## Run it locally

```bash
python3 -m http.server 4173 --directory site
```

Then open http://localhost:4173.

## Go live checklist

All store and launch settings live in **`site/js/config.js`**:

1. **Shopify:** create the products (hardcover, signed, paperback, ebook, team packs) and a Storefront API token, then fill in `shopify.domain`, `shopify.storefrontAccessToken` and each `productId`. The buy buttons become Shopify Buy Buttons with a cart and checkout, and prices come from Shopify.
   - Until then, buy buttons send visitors to the email signup, so the site is safe to publish early.
2. **Email:** set `newsletter.action` to your list provider's form endpoint and `freeChapterUrl` to the Introduction PDF.
3. **Launch:** update `launchLabel`, and set `status` to `"available"` on launch day. The buttons then change from "Pre-order" to "Buy".
4. **To confirm:** placeholder prices, the `hello@thecourseisover.com` contact address and the domain are assumptions. Add an author photo to replace the "ME" placeholder in the author section.

Brand (from the book's typesetting): Montserrat (Heavy Italic), Playfair Display Italic, Source Serif 4; cream `#F5EEE6`, ink `#1C1B19`, orange `#FF5A1F` (text-safe rust `#B8360A`).

/*
 * Store settings for The Course Is Over.
 *
 * Everything the site needs to sell lives here, so going live means editing
 * only this file:
 *   1. In Shopify admin: Settings → Apps and sales channels → Develop apps
 *      (or install the "Headless" channel), create a Storefront API token
 *      with the unauthenticated_read_product_listings and
 *      unauthenticated_write_checkouts scopes.
 *   2. Paste the store domain and token below.
 *   3. For each format, paste the numeric Shopify product ID (Products →
 *      open product → the number at the end of the URL).
 *
 * Until `shopify.domain` and `shopify.storefrontAccessToken` are filled in,
 * the buy buttons fall back to `fallbackUrl` (or the signup section), so the
 * site is safe to publish before the store is ready.
 *
 * Prices here are display placeholders. Once Shopify is connected, the live
 * price from Shopify replaces them.
 */
window.COURSE_CONFIG = {
  status: "preorder", // "preorder" | "available"
  launchLabel: "Spring 2027", // shown in the hero and buy section

  shopify: {
    domain: "",               // e.g. "the-course-is-over.myshopify.com"
    storefrontAccessToken: "", // public Storefront API token (safe for the browser)
    cartTitle: "Your order",
  },

  formats: [
    {
      key: "hardcover",
      name: "Hardcover",
      price: "$28",
      note: "First edition. Ships on release day.",
      productId: "",
      fallbackUrl: "",
      featured: true,
    },
    {
      key: "signed",
      name: "Signed hardcover",
      price: "$35",
      note: "Signed and dated by the author. Limited run.",
      productId: "",
      fallbackUrl: "",
    },
    {
      key: "paperback",
      name: "Paperback",
      price: "$19",
      note: "Lighter to carry to the next offsite.",
      productId: "",
      fallbackUrl: "",
    },
    {
      key: "ebook",
      name: "Ebook",
      price: "$12.99",
      note: "EPUB + PDF, delivered by email.",
      productId: "",
      fallbackUrl: "",
    },
  ],

  teamPacks: [
    { key: "team10", name: "Team pack · 10", price: "$230", note: "Save 18% · includes the team discussion guide", productId: "", fallbackUrl: "" },
    { key: "team25", name: "Team pack · 25", price: "$525", note: "Save 25% · plus a live Q&A with the author", productId: "", fallbackUrl: "" },
  ],

  /*
   * Email signup. Set `action` to your provider's form endpoint
   * (Shopify customer form, Mailchimp, Kit, etc.). Leave it empty to show a
   * friendly "list opens soon" message instead of sending anywhere.
   */
  newsletter: {
    action: "",
    method: "POST",
    emailField: "email",
    freeChapterUrl: "", // link to the free chapter PDF sent after signup
  },

  // Analytics IDs are optional; nothing loads while these are empty.
  analytics: {
    plausibleDomain: "",
  },
};

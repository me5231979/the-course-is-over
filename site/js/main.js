(() => {
  "use strict";

  const cfg = window.COURSE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPreorder = cfg.status !== "available";
  const shop = cfg.shopify || {};
  const shopReady = Boolean(shop.domain && shop.storefrontAccessToken);

  /* ---------- copy that depends on status ---------- */
  $$("[data-launch-label]").forEach((el) => { if (cfg.launchLabel) el.textContent = cfg.launchLabel; });
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  if (!isPreorder) {
    $$("[data-cta-label]").forEach((el) => {
      el.textContent = el.textContent.replace(/Pre-order the book/i, "Buy the book").replace(/Pre-order/i, "Buy now");
    });
    const k = $("[data-buy-kicker]"); if (k) k.textContent = "Buy the book";
    const l = $("[data-buy-lede]"); if (l) l.textContent = "In stock and shipping now. Every order includes the free introduction by email.";
  }
  const buyVerb = isPreorder ? "Pre-order" : "Buy";

  /* ---------- render formats and team packs ---------- */
  const escape = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function formatCard(f) {
    return `
      <article class="format${f.featured ? " format--featured" : ""} reveal" role="listitem" data-key="${escape(f.key)}">
        ${f.featured ? '<span class="format__badge">Most popular</span>' : ""}
        <h3 class="format__name">${escape(f.name)}</h3>
        <div class="format__price" data-price>${escape(f.price)}</div>
        <p class="format__note">${escape(f.note)}</p>
        <div data-buy-slot>${fallbackButton(f, `${buyVerb} ${f.name.toLowerCase()}`)}</div>
      </article>`;
  }
  function packRow(p) {
    return `
      <div class="pack" role="listitem" data-key="${escape(p.key)}">
        <span class="pack__name">${escape(p.name)}</span>
        <span class="pack__price" data-price>${escape(p.price)}</span>
        <span class="pack__note">${escape(p.note)}</span>
        <div data-buy-slot>${fallbackButton(p, buyVerb, true)}</div>
      </div>`;
  }
  function fallbackButton(item, label, small) {
    const cls = `btn btn--ink${small ? " btn--sm" : ""}`;
    if (item.fallbackUrl) {
      return `<a class="${cls}" href="${escape(item.fallbackUrl)}" rel="noopener">${escape(label)}</a>`;
    }
    return `<button class="${cls}" type="button" data-notify="${escape(item.name)}">${escape(label)}</button>`;
  }

  const formatsEl = $("[data-formats]");
  const teamsEl = $("[data-teams]");
  if (formatsEl) formatsEl.innerHTML = (cfg.formats || []).map(formatCard).join("");
  if (teamsEl) teamsEl.innerHTML = (cfg.teamPacks || []).map(packRow).join("");

  // Lowest price for the sticky mobile bar
  const lowest = (cfg.formats || [])
    .map((f) => ({ f, n: parseFloat(String(f.price).replace(/[^0-9.]/g, "")) }))
    .filter((x) => !Number.isNaN(x.n))
    .sort((a, b) => a.n - b.n)[0];
  const stickyPrice = $("[data-sticky-price]");
  if (stickyPrice && lowest) stickyPrice.textContent = `from ${lowest.f.price}`;

  // Until the store is connected, buy buttons send people to the email list.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-notify]");
    if (!btn) return;
    const msg = $("[data-signup-msg]");
    const input = $("#email");
    $("#chapter").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (msg) {
      msg.classList.remove("is-error");
      msg.textContent = `Ordering for the ${btn.dataset.notify.toLowerCase()} opens soon. Leave your email and we'll send the link the moment it's live, plus the free chapter.`;
    }
    setTimeout(() => input && input.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  });

  /* ---------- Shopify Buy Button ---------- */
  if (shopReady) mountShopify();

  function mountShopify() {
    const items = [...(cfg.formats || []), ...(cfg.teamPacks || [])].filter((i) => i.productId);
    if (!items.length) return;
    const s = document.createElement("script");
    s.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
    s.async = true;
    s.onload = () => {
      const client = window.ShopifyBuy.buildClient({ domain: shop.domain, storefrontAccessToken: shop.storefrontAccessToken });
      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        const btnStyle = {
          "font-family": "Montserrat, system-ui, sans-serif",
          "font-weight": "700",
          "font-size": "15px",
          "padding-top": "16px",
          "padding-bottom": "16px",
          "border-radius": "999px",
          width: "100%",
          "background-color": "#1C1B19",
          color: "#F5EEE6",
          ":hover": { "background-color": "#2d2b28" },
          ":focus": { "background-color": "#2d2b28" },
        };
        items.forEach((item) => {
          const card = document.querySelector(`[data-key="${CSS.escape(item.key)}"]`);
          const slot = card && card.querySelector("[data-buy-slot]");
          if (!slot) return;
          slot.innerHTML = "";
          const featured = card.classList.contains("format--featured");
          ui.createComponent("product", {
            id: item.productId,
            node: slot,
            moneyFormat: "%24%7B%7Bamount%7D%7D",
            options: {
              product: {
                iframe: false,
                contents: { img: false, title: false, price: false, options: false },
                text: { button: `${buyVerb}`, outOfStock: "Sold out" },
                styles: { button: featured ? { ...btnStyle, "background-color": "#FF5A1F", color: "#1C1B19", ":hover": { "background-color": "#ff6d38" } } : btnStyle },
              },
              cart: {
                text: { title: shop.cartTitle || "Your order", button: "Checkout", total: "Subtotal" },
                styles: { button: { ...btnStyle, "background-color": "#FF5A1F", color: "#1C1B19", ":hover": { "background-color": "#ff6d38" } } },
                popup: false,
              },
              toggle: { styles: { toggle: { "background-color": "#1C1B19", ":hover": { "background-color": "#FF5A1F" } } } },
            },
          });
          // Show the live price from Shopify instead of the placeholder
          client.product.fetch(`gid://shopify/Product/${item.productId}`).then((p) => {
            const v = p && p.variants && p.variants[0];
            const amt = v && (v.price?.amount ?? v.price);
            if (amt) card.querySelector("[data-price]").textContent = `$${Number(amt).toFixed(Number(amt) % 1 ? 2 : 0)}`;
          }).catch(() => {});
        });
      });
    };
    document.head.appendChild(s);
  }

  /* ---------- email signup ---------- */
  const form = $("[data-signup]");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const msg = $("[data-signup-msg]");
      const btn = form.querySelector("button");
      const value = input.value.trim();
      msg.classList.remove("is-error");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg.classList.add("is-error");
        msg.textContent = "Please enter a valid email address, like you@company.com.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      const nl = cfg.newsletter || {};
      if (!nl.action) {
        msg.textContent = "Thanks! The list opens very soon. We'll send the chapter as soon as it does.";
        form.reset();
        return;
      }
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "Sending…";
      try {
        const body = new FormData();
        body.append(nl.emailField || "email", value);
        await fetch(nl.action, { method: nl.method || "POST", body, mode: "no-cors" });
        msg.textContent = nl.freeChapterUrl
          ? "You're in. Check your inbox, or start reading right now."
          : "You're in. Check your inbox for the chapter.";
        if (nl.freeChapterUrl) {
          const a = document.createElement("a");
          a.href = nl.freeChapterUrl; a.textContent = " Open the chapter →"; a.style.fontWeight = "800";
          msg.appendChild(a);
        }
        form.reset();
      } catch {
        msg.classList.add("is-error");
        msg.textContent = "Something went wrong. Please try again in a moment.";
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }

  /* ---------- nav + sticky buy bar ---------- */
  const nav = $("[data-nav]");
  const sticky = $("[data-sticky-buy]");
  const hero = $(".hero");
  const buy = $("#buy");
  if (sticky) sticky.hidden = false;
  let heroGone = false, buyVisible = false;
  const syncSticky = () => sticky && sticky.classList.toggle("is-visible", heroGone && !buyVisible);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; nav.classList.toggle("is-scrolled", heroGone); syncSticky(); }, { rootMargin: "-80px 0px 0px 0px" }).observe(hero);
    new IntersectionObserver(([e]) => { buyVisible = e.isIntersecting; syncSticky(); }).observe(buy);
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [];
        const i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- count-up numbers ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const counters = $$("[data-count]");
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target, end = Number(el.dataset.count), t0 = performance.now(), dur = 1200;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = "0";
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- training wheels scroll story ---------- */
  const wheels = $("[data-wheels]");
  if (wheels) {
    const stages = $$("[data-stage]", wheels);
    const meter = $("[data-meter]", wheels);
    const back = $(".tw--back", wheels), front = $(".tw--front", wheels), frame = $(".bike__frame", wheels);
    const setStage = (n) => {
      stages.forEach((li, i) => li.classList.toggle("is-active", i === n));
      const support = [1, 0.66, 0.33, 0][n];
      if (meter) meter.style.transform = `scaleX(${support})`;
      const off = n >= 3;
      const loose = n === 2;
      back.style.transform = off ? "translate(-160px, 40px) rotate(-220deg)" : loose ? "translate(-6px, 4px) rotate(-12deg)" : "";
      front.style.transform = off ? "translate(220px, 40px) rotate(260deg)" : loose ? "translate(6px, 4px) rotate(12deg)" : "";
      back.style.opacity = front.style.opacity = off ? "0" : "1";
      frame.style.transform = off ? "translateX(18px)" : "";
    };
    const mobile = window.matchMedia("(max-width: 860px)");
    let current = -1, ticking = false;
    const onScroll = () => {
      ticking = false;
      let n;
      if (mobile.matches) {
        // Mobile: no pinned section; step through stages as the art crosses the viewport.
        const r = wheels.getBoundingClientRect();
        const p = 1 - (r.bottom - innerHeight * 0.35) / (r.height + innerHeight * 0.1);
        n = Math.max(0, Math.min(3, Math.floor(p * 4)));
      } else {
        const r = wheels.getBoundingClientRect();
        const total = r.height - innerHeight;
        const p = Math.max(0, Math.min(0.999, -r.top / total));
        n = Math.floor(p * 4);
      }
      if (n !== current) { current = n; setStage(n); }
    };
    if (reduceMotion) {
      setStage(0);
      stages.forEach((li) => li.classList.add("is-active"));
    } else {
      setStage(0);
      window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      onScroll();
    }
  }

  /* ---------- gentle book tilt on pointer ---------- */
  const book = $("[data-tilt]");
  if (book && !reduceMotion && window.matchMedia("(hover: hover) and (min-width: 861px)").matches) {
    const zone = book.parentElement;
    zone.addEventListener("pointermove", (e) => {
      const r = zone.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      book.style.transform = `rotateY(${-14 + x * 16}deg) rotateX(${3 - y * 10}deg)`;
    });
    zone.addEventListener("pointerleave", () => { book.style.transform = ""; });
  }

  /* ---------- optional analytics ---------- */
  const a = cfg.analytics || {};
  if (a.plausibleDomain) {
    const s = document.createElement("script");
    s.defer = true; s.dataset.domain = a.plausibleDomain; s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }
})();

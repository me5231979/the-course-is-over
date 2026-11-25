/* The Course Is Over theme script. No dependencies. */
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Training wheels: the coach fades stage by stage as the section scrolls by.
  // With reduced motion (or no JS) every stage simply shows at once.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-wheels]').forEach(function (section) {
    var stages = section.querySelectorAll('[data-stage]');
    var count = stages.length;
    if (!count || reduceMotion) return;
    section.classList.add('is-animated');
    var meter = section.querySelector('[data-meter]');
    var frame = section.querySelector('[data-frame]');
    var back = section.querySelector('[data-wheel="back"]');
    var front = section.querySelector('[data-wheel="front"]');
    var mobile = window.matchMedia('(max-width: 899px)');
    var current = -1;
    var ticking = false;

    function setStage(n) {
      stages.forEach(function (li, i) { li.classList.toggle('is-active', i === n); });
      var progress = count > 1 ? n / (count - 1) : 1;
      if (meter) meter.style.transform = 'scaleX(' + (1 - progress) + ')';
      var off = n === count - 1 && count > 1;
      var loose = !off && progress >= 0.5;
      if (back) {
        back.style.transform = off ? 'translate(-160px, 40px) rotate(-220deg)' : loose ? 'translate(-6px, 4px) rotate(-12deg)' : '';
        back.style.opacity = off ? '0' : '1';
      }
      if (front) {
        front.style.transform = off ? 'translate(220px, 40px) rotate(260deg)' : loose ? 'translate(6px, 4px) rotate(12deg)' : '';
        front.style.opacity = off ? '0' : '1';
      }
      if (frame) frame.style.transform = off ? 'translateX(18px)' : '';
    }

    function update() {
      ticking = false;
      var r = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var p;
      if (mobile.matches) {
        p = 1 - (r.bottom - vh * 0.35) / (r.height + vh * 0.1);
      } else {
        p = -r.top / Math.max(1, r.height - vh);
      }
      var n = Math.max(0, Math.min(count - 1, Math.floor(Math.max(0, Math.min(0.999, p)) * count)));
      if (n !== current) { current = n; setStage(n); }
    }

    setStage(0);
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  });

  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  function updateCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });
  }

  // Format picker + AJAX add to cart
  document.querySelectorAll('[data-buy-form]').forEach(function (form) {
    var idInput = form.querySelector('[data-variant-input]');
    var button = form.querySelector('[data-add-button]');
    var status = form.querySelector('[data-buy-status]');

    function render(radio) {
      if (!radio) return;
      idInput.value = radio.value;
      var available = radio.dataset.available === 'true';
      button.disabled = !available;
      button.textContent = '';
      if (available) {
        button.append(button.dataset.labelAdd + ' · ');
        var price = document.createElement('span');
        price.setAttribute('data-price-label', '');
        price.textContent = radio.dataset.price;
        button.append(price);
      } else {
        button.textContent = button.dataset.labelSoon;
      }
      if (status) status.textContent = '';
    }

    form.querySelectorAll('input[type=radio]').forEach(function (radio) {
      radio.addEventListener('change', function () { render(radio); });
    });

    form.addEventListener('submit', function (event) {
      if (!window.fetch || event.submitter && event.submitter.name !== 'add') return;
      event.preventDefault();
      button.disabled = true;
      fetch(root + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(idInput.value), quantity: 1 }] })
      })
        .then(function (res) { return res.json().then(function (data) { if (!res.ok) throw data; return data; }); })
        .then(function () { return fetch(root + 'cart.js').then(function (r) { return r.json(); }); })
        .then(function (cart) {
          updateCount(cart.item_count);
          if (status) {
            status.innerHTML = '';
            status.append('Added to your cart. ');
            var a = document.createElement('a');
            a.href = root + 'cart';
            a.textContent = 'View cart';
            status.append(a);
          }
        })
        .catch(function (err) {
          if (status) status.textContent = (err && err.description) || 'Something went wrong. Try again.';
        })
        .finally(function () { button.disabled = false; });
    });
  });
})();

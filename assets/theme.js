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

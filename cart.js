(function applyBloomTheme() {
  const t = localStorage.getItem('bloom_theme');
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-bloom-theme', t);
  } else {
    document.documentElement.removeAttribute('data-bloom-theme');
  }
})();

window.setBloomTheme = function (mode) {
  if (mode !== 'dark' && mode !== 'light') return;
  localStorage.setItem('bloom_theme', mode);
  document.documentElement.setAttribute('data-bloom-theme', mode);
};

const cartItems = JSON.parse(localStorage.getItem('bloom_cart') || '[]');

function toggleCart() {
  const dropdown = document.getElementById('cart-dropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('cart-dropdown');
  if (!dropdown) return;
  if (!e.target.closest('.nav-cart') && !e.target.closest('.cart-dropdown') && !e.target.closest('.cart-item-remove')) {
    dropdown.classList.remove('open');
  }
});

document.querySelectorAll('.card').forEach(card => {
  const btn = card.querySelector('.card-button');
  const nameEl = card.querySelector('.card-title');
  const priceEl = card.querySelector('.card-price');
  if (!btn || !nameEl || !priceEl) return;
  const name = nameEl.textContent;
  const price = priceEl.textContent;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    addToCart(name, price);
  });
});

function addToCart(name, price) {
  cartItems.push({ name, price });
  localStorage.setItem('bloom_cart', JSON.stringify(cartItems));
  renderCart();
}
window.addToCart = addToCart;

function removeFromCart(index) {
  cartItems.splice(index, 1);
  const meta = JSON.parse(localStorage.getItem('bloom_cart_meta') || '[]');
  meta.splice(index, 1);
  localStorage.setItem('bloom_cart', JSON.stringify(cartItems));
  localStorage.setItem('bloom_cart_meta', JSON.stringify(meta));
  renderCart();
}
window.removeFromCart = removeFromCart;

function renderCart() {
  const container = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (!container || !countEl || !totalEl) return;

  countEl.style.display = cartItems.length > 0 ? 'flex' : 'none';
  countEl.textContent = cartItems.length;

  if (cartItems.length === 0) {
    container.innerHTML = '<p class="cart-empty">No items yet</p>';
    totalEl.textContent = '$0.00';
    const oldBtn = document.querySelector('.cart-order-btn');
    if (oldBtn) oldBtn.remove();
    return;
  }

  container.innerHTML = cartItems.map((item, i) => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>${item.price}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
    </div>
  `).join('');

  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace('$', ''));
  }, 0);

  const oldBtn = document.querySelector('.cart-order-btn');
  if (oldBtn) oldBtn.remove();

  totalEl.textContent = '$' + total.toFixed(2);
  const isInSubfolder = window.location.pathname.includes('/flowers/');
  const orderPath = isInSubfolder ? '../order.html' : 'order.html';
  container.insertAdjacentHTML('afterend',
    `<a class="cart-order-btn" href="${orderPath}">Proceed to order →</a>`
  );
}

renderCart();

const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');

if (cursor && dot) {
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });
  document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const isDark = document.documentElement.getAttribute('data-bloom-theme') === 'dark';
      cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursor.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(28, 61, 42, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}

function toggleAccount() {
  document.getElementById('account-dropdown').classList.toggle('open');
}

function logout() {
  localStorage.removeItem('bloom_user');
  localStorage.removeItem('bloom_email');
  location.reload();
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('account-menu');
  const dd = document.getElementById('account-dropdown');
  if (menu && dd && !e.target.closest('#account-menu')) {
    dd.classList.remove('open');
  }
});

const user = localStorage.getItem('bloom_user');
const authButtons = document.getElementById('auth-buttons');
const accountMenu = document.getElementById('account-menu');
const accountName = document.getElementById('account-name');
const accountEmail = document.getElementById('account-email');
if (user && authButtons && accountMenu && accountName && accountEmail) {
  authButtons.style.display = 'none';
  accountMenu.style.display = 'block';
  accountName.textContent = user;
  accountEmail.textContent = localStorage.getItem('bloom_email') || user;
}

// Wishlist
const wishlistItems = JSON.parse(localStorage.getItem('bloom_wishlist') || '[]');
const wishlistBtn = document.querySelector('.wishlist');
if (wishlistBtn) {
  const titleEl = document.querySelector('.product-info h1');
  const priceEl = document.querySelector('.product-price');
  if (titleEl && priceEl) {
    const name = titleEl.textContent;
    const isInWishlist = wishlistItems.some(i => i.name === name);
    if (isInWishlist) {
      wishlistBtn.textContent = '♥ Wishlisted';
      wishlistBtn.style.color = '#b5763a';
    }
    wishlistBtn.addEventListener('click', function () {
      const idx = wishlistItems.findIndex(i => i.name === name);
      if (idx === -1) {
        wishlistItems.push({ name, price: priceEl.textContent });
        wishlistBtn.textContent = '♥ Wishlisted';
        wishlistBtn.style.color = '#b5763a';
      } else {
        wishlistItems.splice(idx, 1);
        wishlistBtn.textContent = '♡ Wishlist';
        wishlistBtn.style.color = '';
      }
      localStorage.setItem('bloom_wishlist', JSON.stringify(wishlistItems));
    });
  }
}
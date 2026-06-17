/* ============================================================
   STAROK — Vanilla JS E-commerce Logic
   ------------------------------------------------------------
   Modules:
   1.  Product data
   2.  State (cart + catalog filters) & persistence
   3.  Catalog: filter / search / sort
   4.  Render products + pagination
   5.  Cart logic (add / remove / qty / totals)
   6.  Cart drawer UI
   7.  Checkout modal
   8.  Order submission (mock Google Apps Script POST)
   9.  Form validation + UA phone mask
   10. Toast notifications
   11. Utilities
   12. Init / event wiring
============================================================ */

/* ===================== 1. PRODUCT DATA ===================== */
const PRODUCTS = [
  // ── Болти ──
  // DIN603 = грибовидна (mushroom/carriage) head → bolt_grib.jpg
  { id: 1,  name: 'DIN603 Болт з грибовидною головкою М10х100, кл.4.8, оц', category: 'bolts', catLabel: 'Болти', price: 116.90, unit: 'кг',     emoji: '🔩', image: 'images/болт_гриб_гол.jpg' },
  { id: 2,  name: 'DIN603 Болт з грибовидною головкою М6х20, кл.4.8, оц',   category: 'bolts', catLabel: 'Болти', price: 123.90, unit: 'кг',     emoji: '🔩', image: 'images/болт_гриб_гол.jpg' },
  { id: 3,  name: 'DIN603 Болт з грибовидною головкою М8х100, кл.4.8, оц',  category: 'bolts', catLabel: 'Болти', price: 120.10, unit: 'кг',     emoji: '🔩', image: 'images/болт_гриб_гол.jpg' },
  // DIN931/DIN933 = шестигранна (hex) head → bolt.jpg
  { id: 4,  name: 'DIN931 Болт з Шестигранною Головкою М10х40, кл.10.9, оксид', category: 'bolts', catLabel: 'Болти', price: 474.85, unit: '100 шт', emoji: '🔩', image: 'images/bolt.jpg' },
  { id: 5,  name: 'DIN931 Болт з Шестигранною Головкою М12х50, кл.10.9, оксид', category: 'bolts', catLabel: 'Болти', price: 795.79, unit: '100 шт', emoji: '🔩', image: 'images/bolt.jpg' },
  { id: 6,  name: 'DIN931 Болт з Шестигранною Головкою М16х60, кл.10.9, оксид', category: 'bolts', catLabel: 'Болти', price: 1736.59,unit: '100 шт', emoji: '🔩', image: 'images/bolt.jpg' },
  { id: 7,  name: 'DIN933 Болт з Шестигранною Головкою М10х100, кл.5.8, оц', category: 'bolts', catLabel: 'Болти', price: 109.80, unit: 'кг',     emoji: '🔩', image: 'images/bolt.jpg' },
  { id: 8,  name: 'DIN933 Болт з Шестигранною Головкою М12х20, кл.5.8, оц',  category: 'bolts', catLabel: 'Болти', price: 118.30, unit: 'кг',     emoji: '🔩', image: 'images/bolt.jpg' },
  { id: 9,  name: 'DIN933 Болт з Шестигранною Головкою М8х20, кл.5.8, оц',   category: 'bolts', catLabel: 'Болти', price: 109.80, unit: 'кг',     emoji: '🔩', image: 'images/bolt.jpg' },

  // ── Гайки ──
  // bolt_hex.jpg is actually two hex nuts; nut.jpg is single large nut (кл.10.9)
  { id: 10, name: 'Гайка 10 (1 кг=99 шт)',  category: 'nuts', catLabel: 'Гайки', price: 107.65, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },
  { id: 11, name: 'Гайка 12 (1 кг=60 шт)',  category: 'nuts', catLabel: 'Гайки', price: 107.65, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },
  { id: 12, name: 'Гайка 16 (1 кг=34шт)',   category: 'nuts', catLabel: 'Гайки', price: 107.65, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },
  { id: 13, name: 'Гайка 6 (1кг=469шт)',    category: 'nuts', catLabel: 'Гайки', price: 108.90, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },
  { id: 14, name: 'Гайка 12, кл.10,9',      category: 'nuts', catLabel: 'Гайки', price: 120.29, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },
  { id: 15, name: 'Гайка 24, кл.10,9',      category: 'nuts', catLabel: 'Гайки', price: 126.11, unit: 'кг', emoji: '🔩', image: 'images/nut_975_10.9.jpg' },

  // ── Саморізи ──
  // id 16: DIN7981C — н/кругла головка (pan/round head sharp tip) → samoriz_gostr.jpg
  { id: 16, name: 'Самонаріз з н/кругл гол. DIN7981C 3,5х6,5 оц.',   category: 'self-tapping', catLabel: 'Саморізи', price: 20.95,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz_gostr.jpg' },
  // id 17–18: з пресшайбою (with press washer, drill tip) → samoriz_z_bur.jpg
  { id: 17, name: 'Самонаріз з пресшайбою 4,2х13 (1уп=1000 шт)',      category: 'self-tapping', catLabel: 'Саморізи', price: 38.30,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz_z_bur.jpg' },
  { id: 18, name: 'Самонаріз з пресшайбою 4,2х16 бур (1уп=1000 шт)', category: 'self-tapping', catLabel: 'Саморізи', price: 40.44,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz_z_bur.jpg' },
  // id 19: "тех" (білі) — tech drywall type → samoriz_gk.jpg (black drywall screw)
  { id: 19, name: 'Самонаріз "тех" (білі) 3,5х9,5 (1уп=1000 шт) О',  category: 'self-tapping', catLabel: 'Саморізи', price: 21.97,  unit: '100 шт', emoji: '🔨', image: 'images/саморіз_гк.jpg' },
  // id 20: 3,5х25 дерево — wood self-tapper → samoriz_pres.jpg (pan head sharp)
  { id: 20, name: 'Самонаріз 3,5х25 (дерево) (1уп=1000 шт) О',       category: 'self-tapping', catLabel: 'Саморізи', price: 21.53,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz.jpg' },
  // id 21: 3,5х35 метал — metal self-tapper → samoriz_z_bur.jpg (drill bit tip for metal)
  { id: 21, name: 'Самонаріз 3,5х35 (метал) (1уп=1000 шт) О',        category: 'self-tapping', catLabel: 'Саморізи', price: 30.77,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz.jpg' },
  // id 22–23: дерево longer → samoriz_pres.jpg
  { id: 22, name: 'Самонаріз 4,2х70 (дерево) (1уп=250 шт) О',        category: 'self-tapping', catLabel: 'Саморізи', price: 70.90,  unit: '100 шт', emoji: '🔨', image: 'images/samoriz.jpg' },
  { id: 23, name: 'Самонаріз 4,8х100 (дерево) (1уп=250 шт) О',       category: 'self-tapping', catLabel: 'Саморізи', price: 175.48, unit: '100 шт', emoji: '🔨', image: 'images/samoriz.jpg' },

  // ── Такелаж ──
  // Тарлеп (turnbuckle) → tarlep.jpg
  { id: 24, name: 'DIN1480 Тарлеп кований гак-око М10', category: 'rigging', catLabel: 'Такелаж', price: 50.95,  unit: 'шт', emoji: '⚓', image: 'images/tarlep.jpg' },
  { id: 25, name: 'DIN1480 Тарлеп кований гак-око М12', category: 'rigging', catLabel: 'Такелаж', price: 74.15,  unit: 'шт', emoji: '⚓', image: 'images/tarlep.jpg' },
  // Карабін U (D-shackle) → carabin_UM22.png
  { id: 26, name: 'Карабін U М22',                       category: 'rigging', catLabel: 'Такелаж', price: 149.60, unit: 'шт', emoji: '⚓', image: 'images/carabin_UM22.png' },
  // Карабін пожарний без фіксатора → carabin_without_fix.jpg
  { id: 27, name: 'Карабін пож. без фіксатора 8х80',     category: 'rigging', catLabel: 'Такелаж', price: 13.33,  unit: 'шт', emoji: '⚓', image: 'images/carabin_without_fix.jpg' },
  // Карабін пожарний з фіксатором — same spring-type, best available image
  { id: 28, name: 'Карабін пож. з фіксатором 10х100',    category: 'rigging', catLabel: 'Такелаж', price: 25.47,  unit: 'шт', emoji: '⚓', image: 'images/carabin_without_fix.jpg' },
  // Ланцюг (chain) → lancug.jpg
  { id: 29, name: 'Ланцюг госп. оц 4мм/84м',             category: 'rigging', catLabel: 'Такелаж', price: 30.99,  unit: 'м',  emoji: '⚓', image: 'images/lancug.jpg' },
  { id: 30, name: 'Ланцюг госп. оц 8мм/20м',             category: 'rigging', catLabel: 'Такелаж', price: 126.42, unit: 'м',  emoji: '⚓', image: 'images/lancug.jpg' },

  // ── Шайби ──
  // All washers share shayba.jpg (enlarged flat washer DIN9021)
  { id: 31, name: 'Шайба збільш DIN 9021 6 (1кг=416шт)',  category: 'washers', catLabel: 'Шайби', price: 99.50, unit: 'кг', emoji: '💿', image: 'images/shayba.jpg' },
  { id: 32, name: 'Шайба збільш DIN 9021 8 (1кг=177 шт)', category: 'washers', catLabel: 'Шайби', price: 91.50, unit: 'кг', emoji: '💿', image: 'images/shayba.jpg' },
  { id: 33, name: 'Шайба збільш DIN 9021 10 (1кг=92шт)',  category: 'washers', catLabel: 'Шайби', price: 91.50, unit: 'кг', emoji: '💿', image: 'images/shayba.jpg' },
  { id: 34, name: 'Шайба збільш DIN 9021 12 (1кг=48шт)',  category: 'washers', catLabel: 'Шайби', price: 91.50, unit: 'кг', emoji: '💿', image: 'images/shayba.jpg' },

  // ── Шпильки ──
  // DIN975 кл.10.9 → dark oxide rod → pin_10_9.jpg
  { id: 35, name: 'DIN 975 Шпилька різьбова 14х1000 кл.10,9', category: 'pins', catLabel: 'Шпильки', price: 107.79, unit: 'шт', emoji: '📏', image: 'images/pin_975_10,9.jpg' },
  { id: 36, name: 'DIN 975 Шпилька різьбова 20х1000 кл.10,9', category: 'pins', catLabel: 'Шпильки', price: 233.21, unit: 'шт', emoji: '📏', image: 'images/pin_975_10,9.jpg' },
  // DIN975 кл.4.8 → bright zinc rod → pin_4_8.jpg
  { id: 37, name: 'DIN 975 Шпилька різьбова 30х1000 кл.4,8',  category: 'pins', catLabel: 'Шпильки', price: 334.34, unit: 'шт', emoji: '📏', image: 'images/pin_975_4,8.jpg' },
  // DIN976 → galvanized stud → shpylka976.jpg
  { id: 38, name: 'DIN 976 Шпилька різьбова 10х1000',         category: 'pins', catLabel: 'Шпильки', price: 31.82,  unit: 'шт', emoji: '📏', image: 'images/шпилька976.jpg' },
  { id: 39, name: 'DIN 976 Шпилька різьбова 12х2000',         category: 'pins', catLabel: 'Шпильки', price: 93.40,  unit: 'шт', emoji: '📏', image: 'images/шпилька976.jpg' },
  { id: 40, name: 'DIN 976 Шпилька різьбова 16х1000',         category: 'pins', catLabel: 'Шпильки', price: 112.89, unit: 'шт', emoji: '📏', image: 'images/шпилька976.jpg' },

  // ── Шурупи ──
  // з шестигранною головкою (hex head wood/lag screw) → shurup_6.jpg
  { id: 41, name: 'Шуруп з шестигран./голов. 10х100 (10 кг=188 шт)', category: 'screws', catLabel: 'Шурупи', price: 539.71, unit: '100 шт', emoji: '🪛', image: 'images/shurup_6.jpg' },
  { id: 42, name: 'Шуруп з шестигран./голов. 8х100 (10 кг=316 шт)',  category: 'screws', catLabel: 'Шурупи', price: 321.09, unit: '100 шт', emoji: '🪛', image: 'images/shurup_6.jpg' },
  // до дерева TORX з гол/потай (countersunk TORX for wood) → shurup_torx.jpg
  { id: 43, name: 'Шуруп до дерева TORX з гол/потай 3,5х35 ж/ц',    category: 'screws', catLabel: 'Шурупи', price: 32.23,  unit: '100 шт', emoji: '🪛', image: 'images/shurup_tree_TORX.jpg' },
  { id: 44, name: 'Шуруп до дерева TORX з гол/потай 4,0х40 ж/ц',    category: 'screws', catLabel: 'Шурупи', price: 47.95,  unit: '100 шт', emoji: '🪛', image: 'images/shurup_tree_TORX.jpg' },
  // теслярський з гол/потай (carpenter countersunk) → shurup_tesl_hide.jpg
  { id: 45, name: 'Шуруп теслярський з гол/потай 6х100/50 ж/ц',     category: 'screws', catLabel: 'Шурупи', price: 267.74, unit: '100 шт', emoji: '🪛', image: 'images/shurup_tesl_disk_WCT.jpg' },
  { id: 46, name: 'Шуруп теслярський з гол/потай 8х140/80 ж/ц',     category: 'screws', catLabel: 'Шурупи', price: 619.65, unit: '100 шт', emoji: '🪛', image: 'images/shurup_tesl_disk_WCT.jpg' },
  // теслярський з диск/гол (carpenter pan/disk head, gold) → shurup_tesl_disk.jpg
  { id: 47, name: 'Шуруп теслярський з диск/гол 6х100/50 ж/ц',      category: 'screws', catLabel: 'Шурупи', price: 254.93, unit: '100 шт', emoji: '🪛', image: 'images/шуруп_універсальнйи.jpg' },
  { id: 48, name: 'Шуруп теслярський з диск/гол 8х120/80 ж/ц',      category: 'screws', catLabel: 'Шурупи', price: 582.17, unit: '100 шт', emoji: '🪛', image: 'images/шуруп_універсальнйи.jpg' },
  // універсальний (universal yellow-zinc) → shurup_univ.jpg
  { id: 49, name: 'Шуруп універсальний 3,0х16 (1уп=1000 шт)',        category: 'screws', catLabel: 'Шурупи', price: 15.07,  unit: '100 шт', emoji: '🪛', image: 'images/шуруп_універсальнйи.jpg' },
  { id: 50, name: 'Шуруп універсальний 4,0х20 (1уп=1000 шт)',        category: 'screws', catLabel: 'Шурупи', price: 25.32,  unit: '100 шт', emoji: '🪛', image: 'images/шуруп_універсальнйи.jpg' },
  { id: 51, name: 'Шуруп універсальний 5,0х50 (1уп=250 шт)',         category: 'screws', catLabel: 'Шурупи', price: 75.96,  unit: '100 шт', emoji: '🪛', image: 'images/шуруп_універсальнйи.jpg' },
];

const STORAGE_KEY = 'starok_cart';
const ITEMS_PER_PAGE = 15; // 5 rows × 3 cards on desktop

let cart = loadCart();      // [{ product, qty }]
let activeFilter = 'all';
let searchQuery  = '';
let sortMode     = 'default';
let currentPage  = 1;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch { /* storage unavailable — keep cart in memory only */ }
}
function findCartItem(id) {
  return cart.find(item => item.product.id === id);
}

/* ===================== 3. CATALOG: FILTER / SEARCH / SORT ===================== */
function getFilteredProducts() {
  let list = PRODUCTS.slice();

  if (activeFilter !== 'all') {
    list = list.filter(p => p.category === activeFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q)
    );
  }

  switch (sortMode) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name, 'uk')); break;
  }

  return list;
}

/* ===================== 4. RENDER PRODUCTS + PAGINATION ===================== */
function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const count = document.getElementById('productsCount');
  const list  = getFilteredProducts();

  count.textContent = `Показано ${list.length} товар${pluralUk(list.length)} з ${PRODUCTS.length}`;

  // Empty state
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3>Товарів не знайдено</h3>
        <p>Спробуйте змінити пошуковий запит або категорію</p>
      </div>`;
    renderPagination(0);
    return;
  }

  // Clamp current page within bounds
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = list.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = pageItems.map(renderProductCard).join('');
  renderPagination(totalPages);
}

function renderProductCard(p) {
  const inCart = findCartItem(p.id);
  const safeName = escapeHtml(p.name);

  const media = p.image
    ? `<img src="${p.image}" alt="${safeName}" loading="lazy"
         onerror="this.onerror=null;this.parentNode.innerHTML='<span class=&quot;product-img-emoji&quot;>${p.emoji}</span>'">`
    : `<span class="product-img-emoji">${p.emoji}</span>`;

  const cartIcon = inCart
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg> <span>В кошику · ${inCart.qty}</span>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> <span>Додати</span>`;

  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">${media}</div>
      <div class="product-body">
        <div class="product-cat-tag">${p.catLabel}</div>
        <h3 class="product-name" title="${safeName}">${safeName}</h3>
        <div class="product-price-row">
          <div class="product-price">${formatPrice(p.price)}<small> / ${p.unit}</small></div>
        </div>
        <button class="add-to-cart-btn${inCart ? ' added' : ''}"
                onclick="addToCart(${p.id})"
                aria-label="Додати до кошика: ${safeName}">
          ${cartIcon}
        </button>
      </div>
    </article>`;
}

function renderPagination(totalPages) {
  const container = document.getElementById('paginationContainer');
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  const prevDisabled = currentPage === 1 ? 'disabled' : '';
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';

  let html = `
    <button class="page-btn" onclick="changePage(${currentPage - 1})" ${prevDisabled} aria-label="Попередня сторінка">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
    </button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})"
               aria-label="Сторінка ${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>`;
  }

  html += `
    <button class="page-btn" onclick="changePage(${currentPage + 1})" ${nextDisabled} aria-label="Наступна сторінка">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </button>`;

  container.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===================== 5. CART LOGIC ===================== */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = findCartItem(productId);
  if (existing) {
    existing.qty++;
    showToast(`Кількість «${product.name}» оновлено`);
  } else {
    cart.push({ product, qty: 1 });
    showToast(`«${product.name}» додано до кошика`);
  }

  syncCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  syncCart();
}

function updateQty(productId, delta) {
  const item = findCartItem(productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  syncCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}
function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/** Persist + refresh every cart-dependent surface. */
function syncCart() {
  saveCart();
  updateCartBadge();
  renderCartItems();
  renderProducts();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = getCartItemCount();
  badge.textContent = count;
  badge.setAttribute('data-count', count);
  // Restart pop animation
  badge.classList.remove('pop');
  void badge.offsetWidth;
  badge.classList.add('pop');
  setTimeout(() => badge.classList.remove('pop'), 400);
}

/* ===================== 6. CART DRAWER UI ===================== */
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
  document.getElementById('cartBtn').setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
  document.getElementById('cartBtn').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const list    = document.getElementById('cartItemsList');
  const footer  = document.getElementById('cartFooter');
  const total   = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartItemCount');

  countEl.textContent = cart.length ? `${getCartItemCount()} шт.` : '';

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p>Ваш кошик порожній</p>
        <small>Додайте товари з каталогу</small>
      </div>`;
    footer.hidden = true;
    return;
  }

  footer.hidden = false;
  total.textContent = formatPrice(getCartTotal());

  list.innerHTML = cart.map(item => {
    const safeName = escapeHtml(item.product.name);
    const media = item.product.image
      ? `<img class="cart-item-img" src="${item.product.image}" alt="${safeName}" onerror="this.onerror=null;this.style.display='none'">`
      : `<div class="cart-item-img"><span style="font-size:1.75rem;">${item.product.emoji}</span></div>`;

    return `
      <div class="cart-item" data-id="${item.product.id}">
        ${media}
        <div class="cart-item-info">
          <div class="cart-item-name">${safeName}</div>
          <div class="cart-item-price">${formatPrice(item.product.price * item.qty)}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${item.product.id}, -1)" aria-label="Зменшити кількість">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.product.id}, 1)" aria-label="Збільшити кількість">+</button>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.product.id})" aria-label="Видалити товар">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /></svg>
        </button>
      </div>`;
  }).join('');
}

/* ===================== 7. CHECKOUT MODAL ===================== */
function openCheckoutModal() {
  if (cart.length === 0) return;
  closeCart();

  const overlay = document.getElementById('checkoutModal');
  const inner   = document.getElementById('checkoutModalInner');

  const summaryItems = cart.map(item =>
    `<div class="order-summary-item">• ${escapeHtml(item.product.name)} × ${item.qty} = ${formatPrice(item.product.price * item.qty)}</div>`
  ).join('');

  inner.innerHTML = `
    <div class="modal-header">
      <h2>Оформлення замовлення</h2>
      <button class="close-modal-btn" id="closeModalBtn" aria-label="Закрити">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>

    <div class="order-summary">
      <h3>Ваше замовлення</h3>
      ${summaryItems}
      <div class="order-summary-total">Разом: ${formatPrice(getCartTotal())}</div>
    </div>

    <form id="checkoutForm" novalidate>
      <div class="form-group">
        <label for="fname">Ім'я та прізвище <span>*</span></label>
        <input type="text" id="fname" class="form-control" placeholder="Іван Петренко" autocomplete="name" required />
        <div class="form-error" id="fname-error">Будь ласка, введіть коректне ім'я (тільки літери)</div>
      </div>

      <div class="form-group">
        <label for="fphone">Телефон <span>*</span></label>
        <input type="tel" id="fphone" class="form-control" placeholder="+38 (0XX) XXX-XX-XX" autocomplete="tel" required />
        <div class="form-error" id="fphone-error">Введіть коректний номер телефону (9 цифр)</div>
      </div>

      <div class="form-group">
        <label for="femail">Email</label>
        <input type="email" id="femail" class="form-control" placeholder="email@example.com" autocomplete="email" />
        <div class="form-error" id="femail-error">Введіть коректний email</div>
      </div>

      <div class="form-group">
        <label for="fcity">Місто / Населений пункт <span>*</span></label>
        <input type="text" id="fcity" class="form-control" placeholder="Київ" required />
        <div class="form-error" id="fcity-error">Вкажіть місто доставки</div>
      </div>

      <div class="form-group">
        <label for="fdelivery">Спосіб доставки <span>*</span></label>
        <select id="fdelivery" class="form-control" required>
          <option value="">Оберіть спосіб…</option>
          <option value="Нова Пошта">Нова Пошта</option>
          <option value="Укрпошта">Укрпошта</option>
          <option value="Meest Express">Meest Express</option>
          <option value="Самовивіз">Самовивіз</option>
        </select>
        <div class="form-error" id="fdelivery-error">Оберіть спосіб доставки</div>
      </div>

      <div class="form-group">
        <label for="fcomment">Коментар до замовлення</label>
        <textarea id="fcomment" class="form-control" placeholder="Додаткові побажання, номер відділення НП тощо…"></textarea>
      </div>

      <button type="submit" class="submit-order-btn" id="submitOrderBtn">
        Підтвердити замовлення
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </button>
    </form>`;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  document.getElementById('closeModalBtn').addEventListener('click', closeCheckoutModal);
  document.getElementById('checkoutForm').addEventListener('submit', handleOrderSubmit);
  attachPhoneMask(document.getElementById('fphone'));

  // Focus first field for keyboard users
  setTimeout(() => document.getElementById('fname')?.focus(), 100);
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkoutModal');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ===================== 8. ORDER SUBMISSION (mock) ===================== */
/* To go live: deploy a Google Apps Script web app and paste its URL below.
   While the placeholder is unchanged, submission is simulated locally. */
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

async function handleOrderSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('submitOrderBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> Обробляємо…`;

  const orderData = {
    timestamp:    new Date().toLocaleString('uk-UA'),
    client_name:  document.getElementById('fname').value.trim(),
    client_phone: document.getElementById('fphone').value.trim(),
    client_email: document.getElementById('femail').value.trim(),
    city:         document.getElementById('fcity').value.trim(),
    delivery:     document.getElementById('fdelivery').value,
    comment:      document.getElementById('fcomment').value.trim(),
    order_items:  cart.map(i => `${i.product.name} (${i.product.catLabel}) × ${i.qty} шт. = ${formatPrice(i.product.price * i.qty)}`).join('\n'),
    total_price:  formatPrice(getCartTotal()),
    item_count:   getCartItemCount(),
  };

  try {
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      // Real submission (Apps Script accepts opaque no-cors POST)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } else {
      // Mock network latency
      await new Promise(res => setTimeout(res, 800));
    }

    const orderId = `STRK-${Date.now().toString(36).toUpperCase()}`;
    cart = [];
    syncCart();
    showOrderSuccess(orderId, orderData.client_name);

  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Спробувати ще раз';
    showToast('Помилка відправки. Перевірте з\'єднання.');
  }
}

function showOrderSuccess(orderId, name) {
  document.getElementById('checkoutModalInner').innerHTML = `
    <div class="order-success">
      <div class="success-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2>Замовлення прийнято!</h2>
      <div class="order-id">${orderId}</div>
      <p>Дякуємо, <strong>${escapeHtml(name)}</strong>!<br/>Наш менеджер зв'яжеться з вами найближчим часом для підтвердження.</p>
      <button onclick="closeCheckoutModal()" class="submit-order-btn" style="margin-top:1.5rem;max-width:240px;margin-left:auto;margin-right:auto;">Закрити</button>
    </div>`;
  showToast(`Замовлення ${orderId} успішно оформлено!`);
}

/* ===================== 9. VALIDATION + UA PHONE MASK ===================== */
function validateForm() {
  let ok = true;

  const rules = [
    { id: 'fname',     errorId: 'fname-error',     test: v => /^[А-Яа-яІіЇїЄєҐґA-Za-z\s\-']{2,60}$/.test(v.trim()) },
    { id: 'fphone',    errorId: 'fphone-error',    test: v => /^380\d{9}$/.test(v.replace(/\D/g, '')) },
    { id: 'femail',    errorId: 'femail-error',    test: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v.trim()) },
    { id: 'fcity',     errorId: 'fcity-error',     test: v => /^[А-Яа-яІіЇїЄєҐґA-Za-z\s\-'0-9]{2,50}$/.test(v.trim()) },
    { id: 'fdelivery', errorId: 'fdelivery-error', test: v => v !== '' },
  ];

  rules.forEach(({ id, errorId, test }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errorId);
    if (!el || !err) return;
    const valid = test(el.value);
    el.classList.toggle('error', !valid);
    err.classList.toggle('show', !valid);
    if (!valid) ok = false;
  });

  return ok;
}

/**
 * Ukrainian phone mask → +38 (0XX) XXX-XX-XX
 * Normalizes any input to the 380XXXXXXXXX form, then formats progressively.
 */
function attachPhoneMask(input) {
  input.addEventListener('input', e => {
    let digits = e.target.value.replace(/\D/g, '');

    // Normalize leading prefix to 38…
    if (digits.startsWith('0')) {
      digits = '38' + digits;
    } else if (!digits.startsWith('38') && digits.length > 0) {
      digits = '380';
    }

    let out = '';
    if (digits.length > 0)  out += '+' + digits.substring(0, 2);
    if (digits.length > 2)  out += ' (' + digits.substring(2, 5);
    if (digits.length > 5)  out += ') ' + digits.substring(5, 8);
    if (digits.length > 8)  out += '-' + digits.substring(8, 10);
    if (digits.length > 10) out += '-' + digits.substring(10, 12);

    e.target.value = digits.length === 0 ? '' : out;
  });
}

/* ===================== 10. TOAST NOTIFICATIONS ===================== */
function showToast(message, duration = 3200) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </span>
    <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 450);
  }, duration);
}

/* ===================== 11. UTILITIES ===================== */
function formatPrice(n) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency', currency: 'UAH', minimumFractionDigits: 2,
  }).format(n);
}

/** Ukrainian plural endings for the word «товар». */
function pluralUk(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'ів';
  const r = n % 10;
  if (r === 1) return '';
  if (r >= 2 && r <= 4) return 'и';
  return 'ів';
}

/** Minimal HTML escape for any user/data-driven string injected via innerHTML. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setFilter(filter) {
  currentPage = 1;
  activeFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(a =>
    a.classList.toggle('active', a.dataset.filter === filter)
  );
  // Collapse mobile nav after choosing a category
  document.getElementById('siteNav').classList.remove('mobile-open');
  const menuBtn = document.getElementById('mobileMenuBtn');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = '☰';

  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===================== 12. INIT / EVENT WIRING ===================== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartBadge();

  // Sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Cart drawer
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('continueShoppingBtn').addEventListener('click', e => { e.preventDefault(); closeCart(); });
  document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);

  // Close checkout when clicking the dimmed backdrop
  document.getElementById('checkoutModal').addEventListener('click', e => {
    if (e.target === document.getElementById('checkoutModal')) closeCheckoutModal();
  });

  // Escape closes overlays
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeCheckoutModal(); }
  });

  // Category links (nav + footer)
  document.querySelectorAll('[data-filter]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); setFilter(a.dataset.filter); });
  });

  // Debounced live search
  let searchTimeout;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 1;
      searchQuery = e.target.value;
      renderProducts();
    }, 280);
  });

  // Sorting
  document.getElementById('sortSelect').addEventListener('change', e => {
    currentPage = 1;
    sortMode = e.target.value;
    renderProducts();
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('siteNav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  });
});

/* Expose handlers referenced by inline onclick attributes */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.changePage = changePage;
window.closeCheckoutModal = closeCheckoutModal;

/* === ROMAND Store scripts === */
const CART_KEY = 'romand_demo_cart_v1';

function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const c = loadCart().reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = c;
}
updateCartCount();

function addToCart(product, qty=1){
  if(!product) return;
  const cart = loadCart();
  const idx = cart.findIndex(i=>i.id===product.id);
  if(idx>=0) cart[idx].qty += qty;
  else cart.push({...product, qty});
  saveCart(cart);
}

function addToCartFromCard(btn){
  const card = btn.closest('.product-card');
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = Number(card.dataset.price) || 0;
  const img = card.dataset.img || card.querySelector('img')?.getAttribute('src') || '';
  addToCart({id,name,price,img},1);
  showToast(`${name} đã thêm vào giỏ`);
}

const modal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalImg = document.getElementById('modal-img');
const modalQty = document.getElementById('modal-qty');
let currentProduct = null;

function openModalFromCard(card){
  const id = card.dataset.id;
  const name = card.dataset.name;
  const price = Number(card.dataset.price) || 0;
  const img = card.dataset.img || card.querySelector('img')?.getAttribute('src') || '';
  modalTitle.textContent = name;
  modalDesc.textContent = card.dataset.desc || 'Son ROMAND chính hãng, màu chuẩn, chất mịn.';
  modalPrice.textContent = '₫' + price.toLocaleString('vi-VN');
  modalImg.innerHTML = img ? `<img src="${img}" alt="${name}">` : 'Ảnh';
  modalQty.value = 1;
  currentProduct = {id,name,price,img};
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){ if(modal) { modal.setAttribute('aria-hidden','true'); currentProduct=null; } }

document.addEventListener('click', function(e){
  if(e.target.matches('.view-btn')){
    const card = e.target.closest('.product-card');
    openModalFromCard(card);
  }
});

const addBtn = document.getElementById('modal-add');
if(addBtn){
  addBtn.addEventListener('click', function(){
    if(!currentProduct) return;
    const qty = Number(modalQty.value) || 1;
    addToCart(currentProduct, qty);
    closeModal();
    showToast(`${currentProduct.name} x${qty} đã thêm vào giỏ`);
  });
}

// Toast
const toast = document.getElementById('cart-toast');
let toastTimer = null;
function showToast(text){
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  toast.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ toast.style.display='none'; toast.classList.remove('show'); }, 2000);
}

// Cart button -> go to cart.html
const cartBtn = document.getElementById('cart-btn');
if(cartBtn){
  cartBtn.addEventListener('click', function(){
    window.location.href = 'cart.html';
  });
}

// Testimonials simple slider
(function(){
  const track = document.getElementById('test-track');
  const items = track ? track.querySelectorAll('.test-item') : [];
  const prev = document.getElementById('prev-test');
  const next = document.getElementById('next-test');
  let idx = 0;
  function show(i){
    if(!items.length) return;
    const w = items[0].offsetWidth + 16;
    track.style.transform = `translateX(${-i * w}px)`;
  }
  next && next.addEventListener('click', ()=>{ idx = Math.min(idx+1, items.length-1); show(idx); });
  prev && prev.addEventListener('click', ()=>{ idx = Math.max(idx-1, 0); show(idx); });
  window.addEventListener('resize', ()=> show(idx));
})();

// Newsletter
const newsBtn = document.getElementById('newsletter-btn');
if(newsBtn){
  newsBtn.addEventListener('click', function(){
    const emailEl = document.getElementById('newsletter-email');
    const email = emailEl ? emailEl.value.trim() : '';
    if(!email){ showToast('Vui lòng nhập email hợp lệ'); return; }
    showToast('Cảm ơn! Đã đăng ký ' + email);
    if(emailEl) emailEl.value='';
  });
}

// Load more demo
const loadMore = document.getElementById('load-more');
if(loadMore){
  loadMore.addEventListener('click', function(){
    const grid = document.getElementById('product-grid');
    for(let i=0;i<3;i++){
      const el = document.createElement('article');
      el.className = 'product-card';
      const id = 'romand-extra-' + Date.now() + i;
      el.dataset.id = id;
      el.dataset.name = 'ROMAND Extra — Mới ' + (i+1);
      el.dataset.price = 199000;
      el.dataset.img = 'images/son01.svg';
      el.innerHTML = `
        <div class="product-img"><img src="images/son01.svg" alt="ROMAND Extra"></div>
        <h3>ROMAND Extra — Mới</h3>
        <p class="price">₫199,000</p>
        <div class="card-actions">
          <button class="small view-btn">Xem</button>
          <button class="small" onclick="addToCartFromCard(this)">Thêm</button>
        </div>`;
      grid.appendChild(el);
    }
    showToast('Đã tải thêm sản phẩm');
  });
}

// Accessibility: close modal on ESC
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

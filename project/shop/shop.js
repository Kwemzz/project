const drop = document.getElementById('drop')
const nav=document.getElementById('nav')
drop.addEventListener('click', ()=>{
    nav.classList.toggle("show")
})

const search = document.getElementById('search')
const items = document.querySelectorAll('.items')

search.addEventListener('input', () => {
    const searchTerm = search.value.toLowerCase();

    items.forEach(item => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(searchTerm) ? 'block' : 'none';
    });
});

const cartIcon = document.getElementById('icon');           // your cart icon (id="icon")
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsList = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');  // <-- add this into HTML
let cart = [];

// Toggle dropdown
if (cartIcon && cartDropdown) {
  cartIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('show');
    renderCart();
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && e.target !== cartIcon) {
      cartDropdown.classList.remove('show');
    }
  });
}

// Add-to-cart buttons
document.querySelectorAll('.butcart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name || button.closest('.items')?.querySelector('p')?.textContent || 'Item';
    const price = parseFloat(button.dataset.price) || 0;

    // merge same item by name (increase qty)
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else cart.push({ name, price, qty: 1 });

    updateCount();
    renderCart();
  });
});

function updateCount() {
  if (cartCountEl) {
    const totalQty = cart.reduce((s, i) => s + (i.qty || 1), 0);
    cartCountEl.textContent = totalQty;
  }
}

function renderCart() {
  if (!cartItemsList || !cartTotalEl) return;

  cartItemsList.innerHTML = '';
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li>Cart is empty</li>';
    cartTotalEl.textContent = 'Total: 0.00';
    if (cartCountEl) cartCountEl.textContent = '0';
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += (item.price || 0) * (item.qty || 1);
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${item.name} x${item.qty} - ₦${((item.price||0) * (item.qty||1)).toFixed(2)}</span>
      <button class="remove-btn" data-index="${idx}">x</button>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotalEl.textContent = 'Total: ₦' + total.toFixed(2);

  // hook remove buttons
  cartItemsList.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', (e) => removeFromCart(parseInt(btn.dataset.index, 10)))
  );
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    updateCount();
    renderCart();
  }
}
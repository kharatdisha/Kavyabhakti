console.log('Script loaded');

let cart = [];
let allMedicines = []; // cached from API

document.addEventListener('DOMContentLoaded', async function () {
    await loadAndShowMedicines();

    // Order form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const customerName = document.getElementById('order-customer-name').value;
            const phone = document.getElementById('order-phone').value;
            const address = document.getElementById('order-address').value;

            if (!customerName || !phone) {
                alert('Please fill in all required fields.');
                return;
            }

       const items = cart.map(item => ({
   medicine_id: item.id,
    medicine_name: item.name,
    quantity: item.quantity,
    unit_price: item.price
}));

try {
    await apiPlaceOrder({
       customerName: customerName,  
    phone: phone,
    address: address,
    medicines: items        });

    alert(`Order placed successfully! We will contact you at ${phone} shortly.`);
    cart = [];
    updateCartCount();
    closeOrderModal();
    orderForm.reset();

} catch (err) {
    console.error(err);
    alert(err.message); 
}
        });
    }

    // Request form
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const customerName = document.getElementById('request-customer-name').value;
            const phone = document.getElementById('request-phone').value;
            const medicineName = document.getElementById('request-medicine-name').value;
            const quantity = document.getElementById('quantity').value;

            if (!customerName || !phone || !medicineName || !quantity || quantity <= 0) {
                alert('Please fill in all fields correctly.');
                return;
            }

            try {
await apiPlaceRequest({
    customerName,
    phone,
    medicines: [
        {
            medicine_name: medicineName,
            quantity: parseInt(quantity)
        }
    ]
});               closeRequestModal();
                requestForm.reset();
                const confirmation = document.getElementById('confirmation-message');
                confirmation.style.display = 'block';
                setTimeout(() => { confirmation.style.display = 'none'; }, 3000);
            } catch (err) {
                alert('Failed to submit request. Please try again.');
            }
        });
    }

    // Single order form
    const singleOrderForm = document.getElementById('single-order-form');
    if (singleOrderForm) {
        singleOrderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const medicineName = document.getElementById('medicine-name').value;
            const phone = document.getElementById('phone').value;
            alert(`Order placed for ${medicineName}. We will contact you at ${phone} shortly.`);
            closeSingleOrderModal();
            singleOrderForm.reset();
        });
    }

    // Contact form
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            try {
                await apiSendContact(name, email, message);
                alert('Message sent successfully!');
                contactForm.reset();
            } catch (err) {
                alert('Failed to send message. Please try again.');
            }
        });
    }
});

// Load all medicines from API and display
async function loadAndShowMedicines() {
    try {
        allMedicines = await apiGetMedicines();
        renderMedicineCards(allMedicines, 'All Medicines');
    } catch (err) {
        console.error('Failed to load medicines:', err);
    }
}

function showCategories() {
    const section = document.getElementById('categories');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

async function showAllMedicines() {
    try {
        const medicines = await apiGetMedicines();
        allMedicines = medicines;
        renderMedicineCards(medicines, 'All Medicines');
    } catch (err) {
        console.error('Error loading medicines:', err);
    }
}

async function showMedicines(category) {
    try {
        const medicines = await apiGetMedicinesByCategory(category);
        renderMedicineCards(medicines, category);
    } catch (err) {
        console.error('Error loading category:', err);
    }
}

function renderMedicineCards(medicines, title) {
    const titleEl = document.getElementById('category-title');
    const list = document.getElementById('medicines-ul');
    const listDiv = document.getElementById('medicines-list');

    if (!titleEl || !list || !listDiv) return;

    titleEl.textContent = title;
    list.innerHTML = '';

    medicines.forEach(medicine => {
        const card = document.createElement('div');
        card.className = 'medicine-card';

        const img = document.createElement('img');
        img.src = medicine.image_path || medicine.image || 'index_images/Medical.jpg';
        img.alt = medicine.name;

        const name = document.createElement('h4');
        name.textContent = medicine.name;

        const brand = document.createElement('p');
        brand.className = 'brand';
        brand.textContent = `Brand: ${medicine.brand}`;

        const desc = document.createElement('p');
        desc.className = 'description';
        desc.textContent = medicine.description || '';

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `Price: ₹${medicine.selling_price || medicine.price}`;

        const availability = document.createElement('p');
        availability.className = 'availability';
        const isAvailable = medicine.is_available === 1 || medicine.is_available === true || medicine.available === true;
        availability.textContent = isAvailable ? 'Available' : 'Out of Stock';
        availability.style.color = isAvailable ? 'green' : 'red';

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(brand);
        card.appendChild(desc);
        card.appendChild(price);
        card.appendChild(availability);

        if (isAvailable) {
            const quantityDiv = document.createElement('div');
            quantityDiv.className = 'quantity-container';

            const quantityLabel = document.createElement('label');
            quantityLabel.textContent = 'Quantity: ';
            quantityLabel.className = 'quantity-label';

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = '1';
            quantityInput.className = 'quantity-input';

            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.onclick = () => addToCart(medicine, parseInt(quantityInput.value));

            quantityDiv.appendChild(quantityLabel);
            quantityDiv.appendChild(quantityInput);
            quantityDiv.appendChild(addToCartBtn);
            card.appendChild(quantityDiv);
        } else {
            const requestBtn = document.createElement('button');
            requestBtn.className = 'request-btn';
            requestBtn.textContent = 'Request Medicine';
            requestBtn.onclick = () => openRequestModal(medicine.name);
            card.appendChild(requestBtn);
        }

        const li = document.createElement('li');
        li.appendChild(card);
        list.appendChild(li);
    });

    listDiv.style.display = 'block';
    listDiv.scrollIntoView({ behavior: 'smooth' });
}

// Search medicines
async function searchMedicines() {
    const input = document.getElementById('search-medicine');
    if (!input) return;
    const query = input.value.trim();

    if (query.length === 0) {
        renderMedicineCards(allMedicines, 'All Medicines');
        return;
    }

    try {
        const results = await apiSearchMedicines(query);
        renderMedicineCards(results, `Search: "${query}"`);
    } catch (err) {
        // fallback: filter locally
        const filtered = allMedicines.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase())
        );
        renderMedicineCards(filtered, `Search: "${query}"`);
    }
}

// ── Cart ──────────────────────────────────────────────
function addToCart(medicine, quantity) {
    const existing = cart.find(item => item.id ===medicine._id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: medicine._id,
            name: medicine.name,
            brand: medicine.brand,
            price: medicine.selling_price || medicine.price,
            image: medicine.image_path || medicine.image || 'index_images/Medical.jpg',
            quantity
        });
    }
    updateCartCount();
    alert(`${medicine.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'Total: ₹0';
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Brand: ${item.brand}</p>
                        <p>Price: ₹${item.price}</p>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1"
                        onchange="updateCartQuantity(${index}, parseInt(this.value))">
                    <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
                <div class="cart-item-total">₹${item.price * item.quantity}</div>
            `;
            cartItems.appendChild(itemDiv);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = `Total: ₹${total}`;
    }

    cartModal.style.display = 'block';
}

function updateCartQuantity(index, newQty) {
    if (newQty <= 0) { removeFromCart(index); return; }
    cart[index].quantity = newQty;
    updateCartCount();
    openCartModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal();
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function openOrderModal() {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    orderItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<p>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</p>`;
        orderItems.appendChild(div);
        total += item.price * item.quantity;
    });
    orderTotal.textContent = `Total: ₹${total}`;
    document.getElementById('order-modal').style.display = 'block';
}

function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

function openSingleOrderModal(medicineName) {
    document.getElementById('medicine-name').value = medicineName;
    document.getElementById('single-order-modal').style.display = 'block';
}

function closeSingleOrderModal() {
    document.getElementById('single-order-modal').style.display = 'none';
}

function openRequestModal(medicineName) {
    document.getElementById('request-medicine-name').value = medicineName;
    document.getElementById('request-modal').style.display = 'block';
}

function closeRequestModal() {
    document.getElementById('request-modal').style.display = 'none';
}

// Carousel
let slideIndex = 0;
const slides = ['index_images/abc1.jpg', 'index_images/Medical.jpg', 'index_images/bp.jpg'];

function slideLeft() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    document.querySelector('.hero').style.backgroundImage = `url('${slides[slideIndex]}')`;
}

function slideRight() {
    slideIndex = (slideIndex + 1) % slides.length;
    document.querySelector('.hero').style.backgroundImage = `url('${slides[slideIndex]}')`;
}

function toggleDropdown() {
    const dropdown = document.getElementById('products-dropdown');
    if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

window.onclick = function (event) {
    if (!event.target.matches('.dropdown a')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].style.display === 'block') dropdowns[i].style.display = 'none';
        }
    }
};

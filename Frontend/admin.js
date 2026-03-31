// ── Admin.js ────────────────────────────────────────────────────────────────

// ── API Helpers ──────────────────────────────────────────────────────────────
async function apiLogin(username, password) {
    const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
}

async function apiGetCategories() {
    const res = await fetch('/api/categories', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

async function apiGetMedicines() {
    const res = await fetch('/api/medicines', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch medicines');
    return res.json();
}

async function apiAddMedicine(data) {
    const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add medicine');
    return res.json();
}

async function apiUpdateMedicine(id, data) {
    const res = await fetch(`/api/medicines/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update medicine');
    return res.json();
}

async function apiDeleteMedicine(id) {
    const res = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (!res.ok) throw new Error('Failed to delete medicine');
    return res.json();
}

// ── Auth & Login ─────────────────────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorMessage = document.getElementById('error-message');

        try {
            const data = await apiLogin(username, password);
            if (!data.token) throw new Error('No token received');

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUsername', data.username);

            window.location.href = 'admin-dashboard.html';
        } catch (err) {
            errorMessage.textContent = 'Invalid username or password.';
            console.error(err);
        }
    });
}

// Auto-redirect to dashboard if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (loginForm && localStorage.getItem('adminToken')) {
        window.location.href = 'admin-dashboard.html';
    }
});

// ── Logout ───────────────────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'admin-login.html';
}

// ── Dashboard Initialization ─────────────────────────────────────────────────
async function initDashboard() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }

    try {
        await loadCategories();
        await renderMedicines();
    } catch (err) {
        console.error('Failed to initialize dashboard:', err);
    }

    const usernameEl = document.getElementById('current-username');
    if (usernameEl) usernameEl.textContent = localStorage.getItem('adminUsername') || 'admin';
}

// ── Section Navigation ───────────────────────────────────────────────────────
function showSection(sectionId, event) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if(event) event.target.classList.add('active');
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}
function isCloseToExpiry(expiryDate) {
    if (!expiryDate) return false;
    const diff = new Date(expiryDate) - new Date();
    return diff <= 30 * 24 * 60 * 60 * 1000 && diff >= 0;
}
function isLowStock(stock) { return stock <= 10; }

// ── Medicine Management ───────────────────────────────────────────────────────
let medicines = [];

async function loadCategories() {
    try {
        const cats = await apiGetCategories();
        const sel = document.getElementById('medicine-category');
        const filterSel = document.getElementById('category-filter');
        if (!sel) return;
        sel.innerHTML = '<option value="">Select Category</option>';
        if (filterSel) filterSel.innerHTML = '<option value="">All Categories</option>';
        cats.forEach(c => {
            sel.innerHTML += `<option value="${c._id}">${c.name}</option>`;
            if (filterSel) filterSel.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        });
    } catch (err) {
        console.error('Failed to load categories:', err);
    }
}

async function renderMedicines(list) {
    if (!list) {
        try { medicines = await apiGetMedicines(); list = medicines; }
        catch (err) { console.error('Failed to load medicines:', err); return; }
    }

    const tbody = document.querySelector('#medicines-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach((med, idx) => {
        const expiry = med.expiry_date ? med.expiry_date.split('T')[0] : '';
        const row = document.createElement('tr');
        if (isCloseToExpiry(expiry)) row.classList.add('expiry-warning');
        if (isLowStock(med.stock)) row.classList.add('low-stock');

        const statusBadge = med.is_available
            ? '<span style="color:#27ae60;font-weight:600;">✔ Available</span>'
            : '<span style="color:#e74c3c;font-weight:600;">✘ Out of Stock</span>';

        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><strong>${med.name}</strong></td>
            <td>${med.brand}</td>
            <td>${med.category_name || ''}</td>
            <td>₹${parseFloat(med.purchase_price).toFixed(2)}</td>
            <td>₹${parseFloat(med.selling_price).toFixed(2)}</td>
            <td>${med.gst_percent}%</td>
            <td>${formatDate(expiry)}</td>
            <td>${med.location || '—'}</td>
            <td>${med.stock}</td>
            <td>${statusBadge}</td>
            <td>
                <button onclick="editMedicine('${med._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteMedicine('${med._id}')" class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ── CRUD ─────────────────────────────────────────────────────────────────────
async function addMedicine(e) {
    e.preventDefault();
    const data = {
        name:           document.getElementById('medicine-name').value,
        brand:          document.getElementById('brand-name').value,
        purchase_price: parseFloat(document.getElementById('purchase-price').value),
        selling_price:  parseFloat(document.getElementById('selling-price').value),
        gst_percent:    parseFloat(document.getElementById('gst-percent').value),
        expiry_date:    document.getElementById('expiry-date').value,
        location:       document.getElementById('location').value,
        stock:          parseInt(document.getElementById('stock-quantity').value),
        category_id:    document.getElementById('medicine-category').value
    };

    try {
        await apiAddMedicine(data);
        alert('Medicine added successfully.');
        document.getElementById('add-medicine-form').reset();
        await renderMedicines();
    } catch (err) {
        alert('Failed to add medicine: ' + err.message);
    }
}

async function editMedicine(id) {
    const med = medicines.find(m => m._id === id);
    if (!med) return;

    const newName = prompt('Medicine Name:', med.name); if (newName === null) return;
    const newBrand = prompt('Brand:', med.brand); if (newBrand === null) return;
    const newStock = prompt('Stock:', med.stock); if (newStock === null) return;

    try {
        await apiUpdateMedicine(id, {
            ...med,
            name: newName,
            brand: newBrand,
            stock: parseInt(newStock),
            is_available: parseInt(newStock) > 0
        });
        await renderMedicines();
    } catch (err) {
        alert('Failed to update medicine: ' + err.message);
    }
}

async function deleteMedicine(id) {
    if (!confirm('Delete this medicine?')) return;
    try {
        await apiDeleteMedicine(id);
        await renderMedicines();
    } catch (err) {
        alert('Failed to delete medicine: ' + err.message);
    }
}

// ── Init Dashboard ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDashboard === 'function') initDashboard();
});

// ── Global Functions for HTML ───────────────────────────────────────────────
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
window.logout = logout;
window.addMedicine = addMedicine;
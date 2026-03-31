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

    await loadCategories();
    await renderMedicines();
    await renderOrders();
    await renderRequests();
    initBillingDate();

    const usernameEl = document.getElementById('current-username');
    if (usernameEl) usernameEl.textContent = localStorage.getItem('adminUsername') || 'admin';
}

// ── Section Navigation ───────────────────────────────────────────────────────
function showSection(sectionId, event) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if(event) event.target.classList.add('active');

    if (sectionId === 'billing-management') initBillingDate();
    if (sectionId === 'reports-section') initReports();
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
let expirySortDirection = 'asc';

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

    const statsEl = document.getElementById('medicine-stats');
    if (statsEl) {
        const lowStock = list.filter(m => isLowStock(m.stock)).length;
        const expiringSoon = list.filter(m => isCloseToExpiry(m.expiry_date)).length;
        statsEl.innerHTML =
            `Showing <strong>${list.length}</strong> medicines &nbsp;|&nbsp; ` +
            `<span style="color:#e67e22;">⚠ Low Stock: ${lowStock}</span> &nbsp;|&nbsp; ` +
            `<span style="color:#c0392b;">🗓 Expiring Soon: ${expiringSoon}</span>`;
    }

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:20px;color:#888;">No medicines found.</td></tr>';
        return;
    }

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
            <td><span style="background:#e8f4fd;color:#2980b9;padding:2px 8px;border-radius:12px;font-size:12px;">${med.category_name || ''}</span></td>
            <td>₹${parseFloat(med.purchase_price).toFixed(2)}</td>
            <td>₹${parseFloat(med.selling_price).toFixed(2)}</td>
            <td>${med.gst_percent}%</td>
            <td class="${isCloseToExpiry(expiry) ? 'expiry-warning-text' : ''}">${formatDate(expiry)}</td>
            <td>${med.location || '—'}</td>
            <td class="${isLowStock(med.stock) ? 'low-stock-text' : ''}">${med.stock}</td>
            <td>${statusBadge}</td>
            <td>
                <button onclick="editMedicine('${med._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteMedicine('${med._id}')" class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ── Medicine CRUD ─────────────────────────────────────────────────────────────
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

    const newName     = prompt('Medicine Name:', med.name); if (newName === null) return;
    const newBrand    = prompt('Brand:', med.brand); if (newBrand === null) return;
    const newPurchase = prompt('Purchase Price:', med.purchase_price); if (newPurchase === null) return;
    const newSelling  = prompt('Selling Price:', med.selling_price); if (newSelling === null) return;
    const newStock    = prompt('Stock:', med.stock); if (newStock === null) return;
    const newExpiry   = prompt('Expiry Date (YYYY-MM-DD):', med.expiry_date ? med.expiry_date.split('T')[0] : ''); if (newExpiry === null) return;
    const newLocation = prompt('Location:', med.location); if (newLocation === null) return;

    try {
        await apiUpdateMedicine(id, {
            name: newName,
            brand: newBrand,
            purchase_price: parseFloat(newPurchase),
            selling_price:  parseFloat(newSelling),
            stock:          parseInt(newStock),
            expiry_date:    newExpiry,
            location:       newLocation,
            description:    med.description,
            category_id:    med.category_id?._id || med.category_id,
            image_path:     med.image_path,
            gst_percent:    med.gst_percent,
            is_available:   parseInt(newStock) > 0
        });
        alert('Medicine updated.');
        await renderMedicines();
    } catch (err) {
        alert('Failed to update: ' + err.message);
    }
}

async function deleteMedicine(id) {
    if (!confirm('Delete this medicine?')) return;
    try {
        await apiDeleteMedicine(id);
        await renderMedicines();
    } catch (err) {
        alert('Failed to delete: ' + err.message);
    }
}

// ── Event Listeners ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDashboard === 'function') initDashboard();
});

// Make CRUD functions global for HTML onclick
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
window.logout = logout;
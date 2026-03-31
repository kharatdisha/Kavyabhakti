// ── Auth ──────────────────────────────────────────────────────────────────────
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const data = await apiLogin(username, password);
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUsername', data.username);
            window.location.href = 'admin-dashboard.html';
        } catch (err) {
            errorMessage.textContent = 'Invalid username or password.';
        }
    });
}

// ── Settings ──────────────────────────────────────────────────────────────────
if (document.getElementById('settings-form')) {
    const currentUsernameEl = document.getElementById('current-username');
    if (currentUsernameEl) {
        currentUsernameEl.textContent = localStorage.getItem('adminUsername') || 'admin';
    }

    document.getElementById('settings-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const successMsg = document.getElementById('success-message');
        const errorMsg = document.getElementById('error-message');

        if (newPassword !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match.';
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
            return;
        }

        try {
            await apiUpdateCredentials(newUsername, newPassword);
            localStorage.setItem('adminUsername', newUsername);
            successMsg.style.display = 'block';
            errorMsg.style.display = 'none';
        } catch (err) {
            errorMsg.textContent = err.message || 'Update failed.';
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
        }
    });
}

// ── Dashboard Init ────────────────────────────────────────────────────────────
async function initDashboard() {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = 'admin-login.html';
        return;
    }
    await loadCategories();
    await renderMedicines();
    await renderOrders();
    await renderRequests();
    initBillingDate();
}

// ── Section Navigation ────────────────────────────────────────────────────────
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');

    if (sectionId === 'billing-management') initBillingDate();
    if (sectionId === 'reports-section') initReports();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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

    // Update stats bar
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

    const newName     = prompt('Medicine Name:', med.name);          if (newName === null) return;
    const newBrand    = prompt('Brand:', med.brand);                  if (newBrand === null) return;
    const newPurchase = prompt('Purchase Price:', med.purchase_price); if (newPurchase === null) return;
    const newSelling  = prompt('Selling Price:', med.selling_price);  if (newSelling === null) return;
    const newStock    = prompt('Stock:', med.stock);                  if (newStock === null) return;
    const newExpiry   = prompt('Expiry Date (YYYY-MM-DD):', med.expiry_date ? med.expiry_date.split('T')[0] : ''); if (newExpiry === null) return;
    const newLocation = prompt('Location:', med.location);            if (newLocation === null) return;

    try {
        await apiUpdateMedicine(id, {
            name: newName, brand: newBrand,
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

async function searchMedicines() {
    const query = document.getElementById('medicine-search').value.trim();
    document.getElementById('category-filter').value = '';
    if (!query) { await renderMedicines(); return; }
    try {
        const results = await apiSearchMedicines(query);
        renderMedicines(results);
    } catch (err) {
        const q = query.toLowerCase();
        renderMedicines(medicines.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.brand.toLowerCase().includes(q) ||
            (m.category_name || '').toLowerCase().includes(q)
        ));
    }
}

async function filterByCategory() {
    const cat = document.getElementById('category-filter').value;
    document.getElementById('medicine-search').value = '';
    if (!cat) { renderMedicines(medicines); return; }
    const filtered = medicines.filter(m => m.category_name === cat);
    renderMedicines(filtered);
}

async function resetMedicineFilters() {
    document.getElementById('medicine-search').value = '';
    document.getElementById('category-filter').value = '';
    await renderMedicines();
}

function sortByExpiryDate() {
    const sorted = [...medicines].sort((a, b) => {
        const da = new Date(a.expiry_date || '9999-12-31');
        const db = new Date(b.expiry_date || '9999-12-31');
        return expirySortDirection === 'asc' ? da - db : db - da;
    });
    expirySortDirection = expirySortDirection === 'asc' ? 'desc' : 'asc';
    renderMedicines(sorted);
}

// ── Orders Management ─────────────────────────────────────────────────────────
async function renderOrders() {
    try {
        const orders = await apiGetOrders();
        const tbody = document.querySelector('#orders-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        orders.forEach(order => {
            const medList = order.medicines.map(m => `${m.medicine_name} x${m.quantity}`).join(', ');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.customer_name}</td>
                <td>${order.phone}</td>
                <td>${order.address || ''}</td>
                <td>${medList}</td>
                <td>
                    <select onchange="updateOrderStatus('${order._id}', this.value)">
                        ${['Pending','Confirmed','Delivered','Cancelled'].map(s =>
                            `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load orders:', err);
    }
}

async function updateOrderStatus(id, status) {
    try {
        await apiUpdateOrderStatus(id, status);
    } catch (err) {
        alert('Failed to update order status.');
    }
}

// ── Requests Management ───────────────────────────────────────────────────────
async function renderRequests() {
    try {
        const requests = await apiGetRequests();
        const tbody = document.querySelector('#requests-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        requests.forEach(req => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${req.customer_name}</td>
                <td>${req.phone}</td>
                <td>${req.medicine_name}</td>
                <td>${req.quantity}</td>
                <td>
                    <select onchange="updateRequestStatus('${req._id}', this.value)">
                        ${['Pending','Fulfilled','Rejected'].map(s =>
                            `<option value="${s}" ${req.status === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                    </select>
                    <button onclick="deleteRequest('${req._id}')" class="delete-btn">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load requests:', err);
    }
}

async function updateRequestStatus(id, status) {
    try {
        await apiUpdateRequestStatus(id, status);
    } catch (err) {
        alert('Failed to update request status.');
    }
}

async function deleteRequest(id) {
    if (!confirm('Delete this request?')) return;
    try {
        await apiDeleteRequest(id);
        await renderRequests();
    } catch (err) {
        alert('Failed to delete request.');
    }
}

// ── Billing Management ────────────────────────────────────────────────────────
let billingItems = [];

function initBillingDate() {
    const el = document.getElementById('billing-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN');
}

function showBillingTab(tabId) {
    document.querySelectorAll('.billing-tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.billing-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    if (tabId === 'billing-history') loadBillingHistory();
}

async function searchMedicinesForBilling() {
    const query = document.getElementById('medicine-search-billing').value.trim();
    const suggestionsDiv = document.getElementById('medicine-suggestions');
    if (!query) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    try {
        const results = await apiSearchMedicines(query);
        suggestionsDiv.innerHTML = '';

        if (results.length === 0) {
            suggestionsDiv.classList.remove('show');
            return;
        }

        results.slice(0, 8).forEach(med => {
            const div = document.createElement('div');
            div.className = 'medicine-suggestion-item';
            div.innerHTML = `
                <span class="medicine-name">${med.name}</span>
                <span class="medicine-brand"> — ${med.brand}</span>
                <span class="medicine-category"> | ₹${med.selling_price} | Stock: ${med.stock}</span>
            `;
            div.onclick = () => addMedicineToBill(med);
            suggestionsDiv.appendChild(div);
        });

        suggestionsDiv.classList.add('show');
    } catch (err) {
        console.error('Search failed:', err);
    }
}

function addMedicineToBill(med) {
    const suggestionsDiv = document.getElementById('medicine-suggestions');
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.classList.remove('show');
    document.getElementById('medicine-search-billing').value = '';

    const existing = billingItems.find(i => i.medicine_id === med._id);
    if (existing) { existing.quantity++; }
    else {
        billingItems.push({
            medicine_id:   med._id,
            medicine_name: med.name,
            brand:         med.brand,
            quantity:      1,
            unit_price:    parseFloat(med.selling_price),
            expiry_date:   med.expiry_date ? med.expiry_date.split('T')[0] : ''
        });
    }
    renderBillingTable();
    updateBillingSummary();
}

function renderBillingTable() {
    const tbody = document.getElementById('billing-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (billingItems.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7" style="text-align:center;padding:20px;">No medicines added yet.</td></tr>';
        return;
    }

    billingItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.medicine_name}</td>
            <td>${item.brand}</td>
            <td><input type="number" value="${item.quantity}" min="1"
                onchange="updateBillingQty(${index}, parseInt(this.value))" style="width:60px;"></td>
            <td>₹${item.unit_price}</td>
            <td>${item.expiry_date || 'N/A'}</td>
            <td>₹${(item.unit_price * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeBillingItem(${index})" class="delete-btn">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateBillingQty(index, qty) {
    if (qty < 1) return;
    billingItems[index].quantity = qty;
    renderBillingTable();
    updateBillingSummary();
}

function removeBillingItem(index) {
    billingItems.splice(index, 1);
    renderBillingTable();
    updateBillingSummary();
}

function updateBillingSummary() {
    const subtotal = billingItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const discount = parseFloat(document.getElementById('discount')?.value) || 0;
    const gst = (subtotal - discount) * 0.05;
    const final = subtotal - discount + gst;

    document.getElementById('total-medicines').textContent = billingItems.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('gst').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('final-total').textContent = `₹${final.toFixed(2)}`;
}

function generateBill() {
    if (billingItems.length === 0) { alert('Add medicines first.'); return; }
    updateBillingSummary();
    alert('Bill generated. Click Save Bill to store it.');
}

async function saveBill() {
    if (billingItems.length === 0) { alert('Add medicines first.'); return; }
    const customerName = document.getElementById('customer-name').value;
    if (!customerName) { alert('Enter customer name.'); return; }

    const billData = {
        customerName,
        customerPhone: document.getElementById('customer-phone').value,
        paymentMethod: document.getElementById('payment-method').value,
        discount: parseFloat(document.getElementById('discount').value) || 0,
        items: billingItems
    };

    try {
        const result = await apiSaveBill(billData);
        alert(`Bill ${result.billNumber} saved! Total: ₹${result.finalTotal}`);
        clearBillingForm();
        await renderMedicines(); // refresh stock
    } catch (err) {
        alert('Failed to save bill: ' + err.message);
    }
}

function clearBillingForm() {
    billingItems = [];
    renderBillingTable();
    updateBillingSummary();
    const form = document.getElementById('customer-name');
    if (form) form.value = '';
    const phone = document.getElementById('customer-phone');
    if (phone) phone.value = '';
    const discount = document.getElementById('discount');
    if (discount) discount.value = '0';
}

function printInvoice() {
    window.print();
}

function downloadPDF() {
    alert('PDF download requires a library like jsPDF. Use Print > Save as PDF for now.');
}

async function loadBillingHistory() {
    try {
        const bills = await apiGetBillingHistory();
        const tbody = document.getElementById('billing-history-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        bills.forEach(bill => {
            const medNames = bill.items.map(i => i.medicine_name).join(', ');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.bill_number}</td>
                <td>${bill.customer_name}</td>
                <td>${formatDate(bill.billing_date)}</td>
                <td>${medNames}</td>
                <td>₹${bill.final_total}</td>
                <td>${bill.payment_method}</td>
                <td>
                    <button onclick="deleteBill('${bill._id}')" class="delete-btn">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load billing history:', err);
    }
}

async function deleteBill(id) {
    if (!confirm('Delete this bill?')) return;
    try {
        await apiDeleteBill(id);
        await loadBillingHistory();
    } catch (err) {
        alert('Failed to delete bill.');
    }
}

// ── Reports ───────────────────────────────────────────────────────────────────
function initReports() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const startSel = document.getElementById('report-start-month');
    const endSel   = document.getElementById('report-end-month');
    const yearSels = document.querySelectorAll('#report-year');

    if (startSel) startSel.value = month;
    if (endSel)   endSel.value   = month;
    yearSels.forEach(s => { s.value = String(year); });
}

async function generateMonthlyReport() {
    const startMonth = document.getElementById('report-start-month').value;
    const endMonth   = document.getElementById('report-end-month').value;
    const year       = document.querySelector('#report-year').value;

    try {
        const data = await apiGetReport(startMonth, endMonth, year);
        const s = data.summary;

        document.getElementById('report-total-bills').textContent   = s.totalBills;
        document.getElementById('report-medicines-sold').textContent = s.medicinesSold;
        document.getElementById('report-revenue').textContent        = `₹${s.revenue}`;
        document.getElementById('report-gst').textContent            = `₹${s.gstCollected}`;
        document.getElementById('report-purchase-cost').textContent  = `₹${s.purchaseCost}`;
        document.getElementById('report-profit').textContent         = `₹${s.profit}`;

        const header = document.getElementById('report-header');
        if (header) header.classList.remove('report-header-hidden');
        document.getElementById('report-period').textContent =
            `Period: ${startMonth}/${year} - ${endMonth}/${year}`;

        const tbody = document.getElementById('report-table-body');
        tbody.innerHTML = '';

        if (data.bills.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;">No data for selected period.</td></tr>';
            return;
        }

        data.bills.forEach(bill => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.bill_number}</td>
                <td>${bill.customer_name}</td>
                <td>${formatDate(bill.billing_date)}</td>
                <td>${bill.medicines}</td>
                <td>₹${parseFloat(bill.revenue).toFixed(2)}</td>
                <td>₹${parseFloat(bill.gst_amount).toFixed(2)}</td>
                <td>₹${parseFloat(bill.purchase_cost).toFixed(2)}</td>
                <td>₹${parseFloat(bill.profit).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        alert('Failed to generate report: ' + err.message);
    }
}

function downloadReportPDF() {
    alert('PDF download requires jsPDF. Use Print > Save as PDF for now.');
}

function printReport() {
    window.print();
}

// Close billing suggestions when clicking outside
document.addEventListener('click', function (e) {
    const suggestionsDiv = document.getElementById('medicine-suggestions');
    const searchInput = document.getElementById('medicine-search-billing');
    if (suggestionsDiv && searchInput && !searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
    }
});
// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initDashboard === 'function') {
        initDashboard();
    }
});

// Make functions global for HTML onclick
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
window.updateOrderStatus = updateOrderStatus;
window.updateRequestStatus = updateRequestStatus;
window.deleteRequest = deleteRequest;
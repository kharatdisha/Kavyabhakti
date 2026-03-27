// Central API configuration - URL comes from js/config.js
const API_BASE = CONFIG.API_BASE;

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('adminToken');
}

// Authenticated headers
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err.message);
        throw err;
    }
}

// ── Auth ──────────────────────────────────────────────
async function apiLogin(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

async function apiUpdateCredentials(newUsername, newPassword) {
    return apiFetch('/auth/update-credentials', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ newUsername, newPassword })
    });
}

// ── Medicines ─────────────────────────────────────────
async function apiGetMedicines() {
    return apiFetch('/medicines');
}

async function apiGetCategories() {
    return apiFetch('/medicines/categories');
}

async function apiGetMedicinesByCategory(categoryName) {
    return apiFetch(`/medicines/category/${encodeURIComponent(categoryName)}`);
}

async function apiSearchMedicines(query) {
    return apiFetch(`/medicines/search?q=${encodeURIComponent(query)}`);
}

async function apiAddMedicine(data) {
    return apiFetch('/medicines', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
}

async function apiUpdateMedicine(id, data) {
    return apiFetch(`/medicines/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
}

async function apiDeleteMedicine(id) {
    return apiFetch(`/medicines/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Orders ────────────────────────────────────────────
async function apiPlaceOrder(orderData) {
    return apiFetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
}

async function apiGetOrders() {
    return apiFetch('/orders', { headers: authHeaders() });
}

async function apiUpdateOrderStatus(id, status) {
    return apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

// ── Requests ──────────────────────────────────────────
async function apiSubmitRequest(data) {
    return apiFetch('/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function apiGetRequests() {
    return apiFetch('/requests', { headers: authHeaders() });
}

async function apiUpdateRequestStatus(id, status) {
    return apiFetch(`/requests/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

async function apiDeleteRequest(id) {
    return apiFetch(`/requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Billing ───────────────────────────────────────────
async function apiSaveBill(billData) {
    return apiFetch('/billing', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(billData)
    });
}

async function apiGetBillingHistory() {
    return apiFetch('/billing', { headers: authHeaders() });
}

async function apiDeleteBill(id) {
    return apiFetch(`/billing/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Reports ───────────────────────────────────────────
async function apiGetReport(startMonth, endMonth, year) {
    return apiFetch(`/reports?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}`, {
        headers: authHeaders()
    });
}

// ── Contact ───────────────────────────────────────────
async function apiSendContact(name, email, message) {
    return apiFetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });
}

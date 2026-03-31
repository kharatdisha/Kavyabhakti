// ── Base URL ───────────────────────────────────────────
const API_BASE = 'https://kavyabhakti-backend.onrender.com/api';

// ── Helpers ────────────────────────────────────────────
function getToken() {
    return localStorage.getItem('adminToken');
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ── Auth ──────────────────────────────────────────────
async function apiLogin(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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

// ── Billing ─────────────────────────────────────────
async function apiSaveBill(billData) {
    return apiFetch('/billing', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(billData)
    });
}

async function apiGetBills() {
    return apiFetch('/billing', {
        method: 'GET',
        headers: authHeaders()
    });
}

// ── Reports ─────────────────────────────────────────
// ── Reports ─────────────────────────────────────────
async function apiGetReport(startMonth, endMonth, year) {
    const query = `?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}`;
    return apiFetch(`/reports${query}`, {
        method: 'GET',
        headers: authHeaders()
    });
}


async function apiPlaceOrder(orderData) {
    return apiFetch('/orders', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(orderData)
    });
}
// 🌍 MAKE GLOBAL
window.apiLogin = apiLogin;
window.apiGetMedicines = apiGetMedicines;
window.apiGetCategories = apiGetCategories;
window.apiGetMedicinesByCategory = apiGetMedicinesByCategory;
window.apiSearchMedicines = apiSearchMedicines;
window.apiAddMedicine = apiAddMedicine;
window.apiUpdateMedicine = apiUpdateMedicine;
window.apiDeleteMedicine = apiDeleteMedicine;
window.apiSaveBill = apiSaveBill;
window.apiGetBills = apiGetBills;
window.apiGetReport = apiGetReport;
window.apiPlaceOrder = apiPlaceOrder;
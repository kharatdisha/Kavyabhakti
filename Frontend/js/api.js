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

async function apiGetBillingHistory() {
    return apiFetch('/billing', {
        method: 'GET',
        headers: authHeaders()
    });
}
// Delete a bill by ID
async function apiDeleteBill(id) {
    return apiFetch(`/billing/${id}`, {
        method: 'DELETE',
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

async function apiGetOrders() {
    return apiFetch('/orders', {
        method: 'GET',
        headers: authHeaders()
    });
}
async function apiGetRequests() {
    return apiFetch('/requests', {
        method: 'GET',
        headers: authHeaders()
    });
}

// Update request status
async function apiUpdateRequestStatus(id, status) {
    return apiFetch(`/requests/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

// Delete a request
async function apiDeleteRequest(id) {
    return apiFetch(`/requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// async function apiGetOrders() {
//     return apiFetch('/orders', {
//         method: 'GET',
//         headers: authHeaders()
//     });
// }

async function apiUpdateOrderStatus(id, status) {
    return apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

// Called when order status is changed from the dropdown
async function apiPlaceOrder(orderData) {
    return apiFetch('/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
window.apiGetBillingHistory = apiGetBillingHistory;
window.apiDeleteBill = apiDeleteBill;
window.apiGetReport = apiGetReport;
window.apiGetOrders = apiGetOrders;
window.apiGetRequests = apiGetRequests;
window.apiUpdateRequestStatus = apiUpdateRequestStatus;
window.apiDeleteRequest = apiDeleteRequest;
// window.updateOrderStatus = updateOrderStatus;
window.apiPlaceOrder = apiPlaceOrder;
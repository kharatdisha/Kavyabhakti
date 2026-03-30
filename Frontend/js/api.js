// src/api.js

// ── Base URL ───────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// ── Auth Helpers ───────────────────────────────────────
function getToken() {
    return localStorage.getItem('adminToken');
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ── Generic fetch wrapper ───────────────────────────────
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
export async function apiLogin(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function apiUpdateCredentials(newUsername, newPassword) {
    return apiFetch('/auth/update-credentials', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ newUsername, newPassword })
    });
}

// ── Medicines ─────────────────────────────────────────
export async function apiGetMedicines() {
    return apiFetch('/medicines');
}

export async function apiGetCategories() {
    return apiFetch('/medicines/categories');
}

export async function apiGetMedicinesByCategory(categoryName) {
    return apiFetch(`/medicines/category/${encodeURIComponent(categoryName)}`);
}

export async function apiSearchMedicines(query) {
    return apiFetch(`/medicines/search?q=${encodeURIComponent(query)}`);
}

export async function apiAddMedicine(data) {
    return apiFetch('/medicines', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
}

export async function apiUpdateMedicine(id, data) {
    return apiFetch(`/medicines/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
}

export async function apiDeleteMedicine(id) {
    return apiFetch(`/medicines/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Orders ────────────────────────────────────────────
export async function apiPlaceOrder(orderData) {
    return apiFetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
}

export async function apiGetOrders() {
    return apiFetch('/orders', { headers: authHeaders() });
}

export async function apiUpdateOrderStatus(id, status) {
    return apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

// ── Requests ──────────────────────────────────────────
export async function apiSubmitRequest(data) {
    return apiFetch('/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function apiGetRequests() {
    return apiFetch('/requests', { headers: authHeaders() });
}

export async function apiUpdateRequestStatus(id, status) {
    return apiFetch(`/requests/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status })
    });
}

export async function apiDeleteRequest(id) {
    return apiFetch(`/requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Billing ───────────────────────────────────────────
export async function apiSaveBill(billData) {
    return apiFetch('/billing', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(billData)
    });
}

export async function apiGetBillingHistory() {
    return apiFetch('/billing', { headers: authHeaders() });
}

export async function apiDeleteBill(id) {
    return apiFetch(`/billing/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
}

// ── Reports ───────────────────────────────────────────
export async function apiGetReport(startMonth, endMonth, year) {
    return apiFetch(`/reports?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}`, {
        headers: authHeaders()
    });
}

// ── Contact ───────────────────────────────────────────
export async function apiSendContact(name, email, message) {
    return apiFetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });
}
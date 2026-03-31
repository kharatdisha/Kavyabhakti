// api.js (FINAL WORKING VERSION)

// ── Base URL ───────────────────────────────────────────
const API_BASE = 'https://kavyabhakti-backend.onrender.com/api';
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

async function apiAddMedicine(data) {
    return apiFetch('/medicines', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
}

// 🌍 Make ALL API functions global
window.apiLogin = apiLogin;

window.apiGetMedicines = apiGetMedicines;
window.apiGetCategories = apiGetCategories;
window.apiGetMedicinesByCategory = apiGetMedicinesByCategory;
window.apiSearchMedicines = apiSearchMedicines;
window.apiAddMedicine = apiAddMedicine;
window.apiUpdateMedicine = apiUpdateMedicine;
window.apiDeleteMedicine = apiDeleteMedicine;

window.apiPlaceOrder = apiPlaceOrder;
window.apiGetOrders = apiGetOrders;
window.apiUpdateOrderStatus = apiUpdateOrderStatus;

window.apiSubmitRequest = apiSubmitRequest;
window.apiGetRequests = apiGetRequests;
window.apiUpdateRequestStatus = apiUpdateRequestStatus;
window.apiDeleteRequest = apiDeleteRequest;

window.apiSaveBill = apiSaveBill;
window.apiGetBillingHistory = apiGetBillingHistory;
window.apiDeleteBill = apiDeleteBill;

window.apiGetReport = apiGetReport;

window.apiSendContact = apiSendContact;
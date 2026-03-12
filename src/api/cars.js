// src/api/cars.js
// API utility functions for car management

const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/cars';

import { authFetch } from './fetchWithAuth';

// ── Generic error reader ──────────────────────────────────────────────────────
async function readError(res, fallback) {
    try {
        const body = await res.json();
        // NestJS returns message as string or array
        const msg = body?.message;
        if (Array.isArray(msg)) return msg.join(', ');
        return msg || body?.error || JSON.stringify(body);
    } catch {
        try { return await res.text(); } catch { return fallback; }
    }
}

// ── API Functions ─────────────────────────────────────────────────────────────
export async function getCars() {
    const res = await authFetch(`${API_BASE}`);
    if (!res.ok) throw new Error(await readError(res, 'Failed to fetch cars'));
    return res.json();
}

export async function getCar(carId) {
    const res = await authFetch(`${API_BASE}/${carId}`);
    if (!res.ok) throw new Error(await readError(res, 'Failed to fetch car'));
    return res.json();
}

export async function createCar(carData) {
    const res = await authFetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create car'));
    return res.json();
}

export async function updateCar(carId, carData) {
    const res = await authFetch(`${API_BASE}/${carId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update car'));
    return res.json();
}

export async function deleteCar(carId) {
    const res = await authFetch(`${API_BASE}/${carId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to delete car'));
    return res.json();
}

export async function updateCarPrice(carId, price) {
    const res = await authFetch(`${API_BASE}/${carId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice: price }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update price'));
    return res.json();
}

// Clears/resets price to null (zero) via the general PATCH endpoint.
// Used when the /price endpoint rejects values < 0.01.
export async function resetCarPrice(carId) {
    const res = await authFetch(`${API_BASE}/${carId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice: null }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to reset price'));
    return res.json();
}

export async function updateCarImages(carId, data) {
    // data should be { images: [{ url: '...' }] }
    const res = await authFetch(`${API_BASE}/${carId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update images'));
    return res.json();
}

export async function deleteCarImage(carId, imageId) {
    const res = await authFetch(`${API_BASE}/${carId}/images/${imageId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to delete image'));
    return res.json();
}

export async function reorderCarImages(carId, imageOrder) {
    const res = await authFetch(`${API_BASE}/${carId}/images/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: imageOrder }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to reorder images'));
    return res.json();
}

export async function updateCarAvailability(carId, availability) {
    const res = await authFetch(`${API_BASE}/${carId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update availability'));
    return res.json();
}

export async function updateCarFeatured(carId, featured) {
    const res = await authFetch(`${API_BASE}/${carId}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update featured status'));
    return res.json();
}
// src/api/cars.js
// API utility functions for car management

const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/cars';

export async function getCars() {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json();
}

export async function getCar(carId) {
  const res = await fetch(`${API_BASE}/${carId}`);
  if (!res.ok) throw new Error('Failed to fetch car');
  return res.json();
}

export async function createCar(carData) {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  });
  if (!res.ok) throw new Error('Failed to create car');
  return res.json();
}

export async function updateCar(carId, carData) {
  const res = await fetch(`${API_BASE}/${carId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  });
  if (!res.ok) throw new Error('Failed to update car');
  return res.json();
}

export async function deleteCar(carId) {
  const res = await fetch(`${API_BASE}/${carId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete car');
  return res.json();
}

export async function updateCarPrice(carId, price) {
  const res = await fetch(`${API_BASE}/${carId}/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price })
  });
  if (!res.ok) throw new Error('Failed to update price');
  return res.json();
}

export async function updateCarImages(carId, images) {
  const formData = new FormData();
  images.forEach((img) => formData.append('images', img));
  const res = await fetch(`${API_BASE}/${carId}/images`, {
    method: 'PATCH',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to update images');
  return res.json();
}

export async function deleteCarImage(carId, imageId) {
  const res = await fetch(`${API_BASE}/${carId}/images/${imageId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete image');
  return res.json();
}

export async function reorderCarImages(carId, imageOrder) {
  const res = await fetch(`${API_BASE}/${carId}/images/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: imageOrder })
  });
  if (!res.ok) throw new Error('Failed to reorder images');
  return res.json();
}

export async function updateCarAvailability(carId, availability) {
  const res = await fetch(`${API_BASE}/${carId}/availability`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ availability })
  });
  if (!res.ok) throw new Error('Failed to update availability');
  return res.json();
}

export async function updateCarFeatured(carId, featured) {
  const res = await fetch(`${API_BASE}/${carId}/featured`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ featured })
  });
  if (!res.ok) throw new Error('Failed to update featured status');
  return res.json();
}

// src/api/upload.js
// Utility for uploading images to /api/upload/images (Cloudinary)

export async function uploadImagesToCloudinary(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/upload/images';
  const res = await fetch(API_BASE, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  return res.json(); // Expecting array of image URLs or similar
}

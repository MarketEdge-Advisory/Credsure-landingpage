// src/api/upload.js
// Utility for uploading images to /api/upload/images (Cloudinary)

export async function uploadImagesToCloudinary(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('file', file);
  }); // This is correct for FilesInterceptor('file') in backend
  const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/upload/images';
  // Get access token from sessionStorage (adjust if you store it elsewhere)
  let accessToken = '';
  try {
    const user = JSON.parse(sessionStorage.getItem('admin_user'));
    accessToken = user?.accessToken || user?.data?.accessToken || '';
  } catch {}
  const headers = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    throw new Error('Missing authorization header: Admin user not logged in or token missing');
  }
  const res = await fetch(API_BASE, {
    method: 'POST',
    body: formData,
    headers,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  return res.json(); // Expecting array of image URLs or similar
}

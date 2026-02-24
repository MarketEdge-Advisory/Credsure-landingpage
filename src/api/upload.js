// src/api/upload.js
// Utility for uploading images to /api/upload/images (Cloudinary)

export async function uploadImagesToCloudinary(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  const res = await fetch('/api/upload/images', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  return res.json(); // Expecting array of image URLs or similar
}

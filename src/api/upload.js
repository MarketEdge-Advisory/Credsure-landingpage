// src/api/upload.js
// Utility for uploading images to /api/upload/images (Cloudinary)

// ── Image Compressor ──────────────────────────────────────────────────────────
const compressImage = (file, maxDim = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            let { width, height } = img;

            // Scale down if exceeds maxDim
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = (height / width) * maxDim;
                    width = maxDim;
                } else {
                    width = (width / height) * maxDim;
                    height = maxDim;
                }
            }

            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    URL.revokeObjectURL(url);
                },
                'image/jpeg',
                quality
            );
        };

        img.onerror = () => {
            // If compression fails, fall back to original file
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
};

// ── Upload Function ───────────────────────────────────────────────────────────
export async function uploadImagesToCloudinary(files) {
    // 1. Compress all images before uploading
    const compressed = await Promise.all(Array.from(files).map((file) => compressImage(file)));

    const formData = new FormData();
    compressed.forEach((file) => {
        formData.append('files', file);
    });

    const API_BASE = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/upload/images';

    // 2. Get access token
    let accessToken = '';
    try {
        const user = JSON.parse(sessionStorage.getItem('admin_user'));
        accessToken = user?.accessToken || user?.data?.accessToken || '';
    } catch {}

    if (!accessToken) {
        throw new Error('Missing authorization header: Admin user not logged in or token missing');
    }

    // 3. Set 60s timeout to avoid 499 client-cancelled errors
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
            let errorMessage = `Upload failed with status ${res.status}`;
            try {
                const errorBody = await res.json();
                errorMessage = errorBody?.message || errorBody?.error || JSON.stringify(errorBody);
            } catch {
                errorMessage = await res.text();
            }
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
            throw new Error('Upload timed out. Please try with smaller images.');
        }
        throw err;
    }
}
// import React, { useState, useRef, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import { uploadImagesToCloudinary } from '../../api/upload';
// import { Plus, Search, Pencil, Trash2, Download, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, UploadCloud, Minus } from 'lucide-react';
// import DateRangePicker from '../../components/admin/DateRangePicker';
// import { useCarContext } from '../../context/CarContext';
// import * as carApi from '../../api/cars';

// const PAGE_SIZES = [10, 20, 50];

// const statusConfig = {
//   AVAILABLE: { dot: 'bg-green-500', text: 'text-green-500', label: 'Available' },
//   NOT_AVAILABLE: { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
//   'NOT AVAILABLE': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
//   'Not-Available': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
//   'Not Available': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
//   'Coming Soon': { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
//   COMING_SOON: { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
//   'COMING SOON': { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
// };

// // ---------- Add Vehicle Form ----------
// const AddVehicleForm = ({ onBack, fetchVehicles }) => {
//   const fileInputRef = useRef(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [imagePreviews, setImagePreviews] = useState([]); // { src: dataUrl, file: File }
//   const [form, setForm] = useState({
//     carName: '',
//     description: '',
//     modelYear: '',
//     basePrice: '',
//     variant: '',
//     numberOfUnits: '',
//     engineSpec: '',
//     transmissionSpec: 'Manual',
//     availability: '',
//     fuelTypeSpec: '',
//   });
//   const [formError, setFormError] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   const validateForm = () => {
//     const errors = {};
//     if (!form.carName.trim()) errors.carName = 'Car name is required.';
//     if (!form.description.trim()) errors.description = 'Description is required.';
//     if (!form.basePrice || isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0.01)
//       errors.basePrice = 'Base price must be a number greater than 0.01.';
//     if (!form.variant.trim()) errors.variant = 'Variant is required.';
//     if (!form.numberOfUnits || isNaN(Number(form.numberOfUnits)) || Number(form.numberOfUnits) < 1)
//       errors.numberOfUnits = 'Number of units must be at least 1.';
//     if (!form.engineSpec.trim()) errors.engineSpec = 'Engine specification is required.';
//     if (!form.transmissionSpec.trim()) errors.transmissionSpec = 'Transmission is required.';
//     if (!form.availability) errors.availability = 'Availability is required.';
//     return errors;
//   };

//   const handleNewImageFiles = (files) => {
//     if (!files || files.length === 0) return;
//     const newImages = [];
//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         newImages.push({ src: e.target.result, file });
//         if (newImages.length === files.length) {
//           setImagePreviews((prev) => [...prev, ...newImages]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleRemoveImage = (idx) => {
//     setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
//     if (fileInputRef.current) {
//       const dt = new DataTransfer();
//       Array.from(fileInputRef.current.files).forEach((file, i) => {
//         if (i !== idx) dt.items.add(file);
//       });
//       fileInputRef.current.files = dt.files;
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     handleNewImageFiles(e.dataTransfer.files);
//   };

//   const handleAddVehicle = async () => {
//     setFormError('');
//     const errors = validateForm();
//     setFieldErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       setFormError('Please correct the errors below.');
//       return;
//     }
//     setSaving(true);
//     try {
//       let imageUrls = [];
//       if (imagePreviews.length > 0 && fileInputRef.current && fileInputRef.current.files.length > 0) {
//         const filesToUpload = imagePreviews.map(img => img.file);
//         const uploadResult = await uploadImagesToCloudinary(filesToUpload);
//         // Extract URLs – the response may be wrapped in a 'data' field
//         const resultData = uploadResult?.data || uploadResult;
//         if (resultData.imageUrls && Array.isArray(resultData.imageUrls)) {
//           imageUrls = resultData.imageUrls;
//         } else if (resultData.imageUrl) {
//           imageUrls = [resultData.imageUrl];
//         } else if (resultData.urls && Array.isArray(resultData.urls)) {
//           imageUrls = resultData.urls;
//         } else if (Array.isArray(resultData)) {
//           imageUrls = resultData;
//         }
//       }

//       if (!imageUrls || imageUrls.length === 0 || !imageUrls[0]) {
//         setFormError('Image upload failed. Please try again.');
//         setSaving(false);
//         return;
//       }

//       const carData = {
//         name: form.carName,
//         description: form.description,
//         basePrice: Number(form.basePrice),
//         variant: form.variant,
//         numberOfUnits: Number(form.numberOfUnits),
//         availability: form.availability,
//         specs: {
//           engine: form.engineSpec,
//           transmission: form.transmissionSpec,
//         },
//         // Backend expects images as array of objects with 'url' property
//         images: imageUrls.map(url => ({ url })),
//       };

//       await carApi.createCar(carData);
//       await fetchVehicles();
//       Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle added successfully!' });
//       onBack();
//     } catch (e) {
//       Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to add vehicle' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChange = (field) => (e) => {
//     setForm((prev) => ({ ...prev, [field]: e.target.value }));
//     setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
//   };
  
// const formatNumberWithCommas = (value) => {
//   if (!value && value !== 0) return '';
//   const num = Number(value.toString().replace(/,/g, ''));
//   if (isNaN(num)) return '';
//   return num.toLocaleString('en-US');
// };

//   return (
//     <div className="p-8 w-full">
//       {formError && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {formError}
//         </div>
//       )}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
//       >
//         <ArrowLeft size={15} />
//         Go back
//       </button>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h1>
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div>
//             <p className="font-semibold text-gray-900">Add New Vehicle</p>
//             <p className="text-sm text-gray-400 mt-0.5">Input the details below to add new vehicles</p>
//           </div>
//         </div>
//         <div className="divide-y divide-gray-100">
//           {/* Upload Images Row */}
//           <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
//             <div className="w-full">
//               <p className="text-sm font-medium text-gray-700">Upload Vehicle Images</p>
//             </div>
//             <div className="w-full">
//               <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop multiple images</p>
//               <div
//                 className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
//                   dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
//                 }`}
//                 onClick={() => fileInputRef.current?.click()}
//                 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={handleDrop}
//               >
//                 {imagePreviews.length > 0 ? (
//                   <div className="flex flex-wrap gap-4">
//                     {imagePreviews.map((img, idx) => (
//                       <div key={idx} className="relative group">
//                         <img src={img.src} alt={`Preview ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
//                         <button
//                           type="button"
//                           onClick={e => { e.stopPropagation(); handleRemoveImage(idx); }}
//                           title="Remove image"
//                           className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
//                         >
//                           <span className="leading-none">×</span>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <>
//                     <UploadCloud size={32} className="text-blue-400" />
//                     <p className="text-sm text-gray-500">
//                       <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
//                   </>
//                 )}
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 className="hidden"
//                 onChange={(e) => handleNewImageFiles(e.target.files)}
//               />
//             </div>
//           </div>
//           {/* Car Details Row */}
//           <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
//             <div>
//               <p className="text-sm font-medium text-gray-700">Input Car Details</p>
//             </div>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Name of Model</label>
//                 <input
//                   type="text"
//                   placeholder="Enter car name"
//                   value={form.carName}
//                   onChange={handleChange('carName')}
//                   className={`w-full border ${fieldErrors.carName ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
//                 />
//                 {fieldErrors.carName && <p className="text-xs text-red-500 mt-1">{fieldErrors.carName}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
//                 <textarea
//                   placeholder="Enter Message..."
//                   rows={4}
//                   value={form.description}
//                   onChange={handleChange('description')}
//                   className={`w-full border ${fieldErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none`}
//                 />
//                 {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
//               </div>
//              <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
//   <input
//     type="text"
//     placeholder="Enter amount"
//     value={form.basePrice ? formatNumberWithCommas(form.basePrice) : ''}
//     onChange={(e) => {
//       const raw = e.target.value.replace(/,/g, '');
//       if (raw === '' || /^\d+$/.test(raw)) {
//         setForm(prev => ({ ...prev, basePrice: raw }));
//         setFieldErrors(prev => ({ ...prev, basePrice: undefined }));
//       }
//     }}
//     className={`w-full border ${fieldErrors.basePrice ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
//   />
//   {fieldErrors.basePrice && <p className="text-xs text-red-500 mt-1">{fieldErrors.basePrice}</p>}
// </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
//                 <input
//                   type="text"
//                   placeholder="Enter car variant"
//                   value={form.variant}
//                   onChange={handleChange('variant')}
//                   className={`w-full border ${fieldErrors.variant ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
//                 />
//                 {fieldErrors.variant && <p className="text-xs text-red-500 mt-1">{fieldErrors.variant}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
//                 <input
//                   type="number"
//                   min="1"
//                   placeholder="Enter number of units"
//                   value={form.numberOfUnits}
//                   onChange={handleChange('numberOfUnits')}
//                   className={`w-full border ${fieldErrors.numberOfUnits ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
//                 />
//                 {fieldErrors.numberOfUnits && <p className="text-xs text-red-500 mt-1">{fieldErrors.numberOfUnits}</p>}
//               </div>
//             </div>
//           </div>
//           {/* Car Specifications Row */}
//           <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
//             <div>
//               <p className="text-sm font-medium text-gray-700">Specifications</p>
//             </div>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
//                 <textarea
//                   placeholder="Enter Message..."
//                   rows={4}
//                   value={form.engineSpec}
//                   onChange={handleChange('engineSpec')}
//                   className={`w-full border ${fieldErrors.engineSpec ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none`}
//                 />
//                 {fieldErrors.engineSpec && <p className="text-xs text-red-500 mt-1">{fieldErrors.engineSpec}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
//                 <select
//                   value={form.transmissionSpec}
//                   onChange={handleChange('transmissionSpec')}
//                   className={`w-full border ${fieldErrors.transmissionSpec ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
//                 >
//                   <option value="Manual">Manual</option>
//                   <option value="Automatic">Automatic</option>
//                 </select>
//                 {fieldErrors.transmissionSpec && <p className="text-xs text-red-500 mt-1">{fieldErrors.transmissionSpec}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Stock Availability</label>
//                 <select
//                   value={form.availability || ''}
//                   onChange={handleChange('availability')}
//                   className={`w-full border ${fieldErrors.availability ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
//                 >
//                   <option value="">Select availability</option>
//                   <option value="AVAILABLE">Available</option>
//                   <option value="NOT_AVAILABLE">Not Available</option>
//                   <option value="COMING_SOON">Coming Soon</option>
//                 </select>
//                 {fieldErrors.availability && <p className="text-xs text-red-500 mt-1">{fieldErrors.availability}</p>}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='flex w-full justify-end'>
//           <button
//             className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
//             onClick={handleAddVehicle}
//             disabled={saving}
//           >
//             {saving && (
//               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//               </svg>
//             )}
//             Save Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------- Edit Vehicle Form ----------
// const EditVehicleForm = ({ vehicle, onBack, fetchVehicles }) => {
//   const fileInputRef = useRef(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [existingImageUrls, setExistingImageUrls] = useState([]); // Cloudinary URLs (strings)
//   const [newImageFiles, setNewImageFiles] = useState([]); // Files selected for upload
//   const [newImagePreviews, setNewImagePreviews] = useState([]); // data URLs for preview
//   const [form, setForm] = useState({
//     carName: '',
//     description: '',
//     vehiclePrice: '',
//     variant: '',
//     numberOfUnits: '',
//     engineSpec: '',
//     transmissionSpec: '',
//     availability: '',
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!vehicle) return;
//     setForm({
//       carName: vehicle.name || '',
//       description: vehicle.description || '',
//       vehiclePrice: vehicle.basePrice || '',
//       variant: vehicle.variant || '',
//       numberOfUnits: vehicle.numberOfUnits || '',
//       engineSpec: vehicle.specs?.engine || '',
//       transmissionSpec: vehicle.specs?.transmission || '',
//       availability: vehicle.availability || '',
//     });
//     // Extract existing image URLs from the vehicle's images array (each is { url: string })
//     if (vehicle.images && Array.isArray(vehicle.images)) {
//       setExistingImageUrls(vehicle.images.map(img => img.url));
//     } else if (vehicle.imageUrls && Array.isArray(vehicle.imageUrls)) {
//       // Fallback in case backend returns imageUrls directly
//       setExistingImageUrls(vehicle.imageUrls);
//     } else if (vehicle.primaryImageUrl) {
//       setExistingImageUrls([vehicle.primaryImageUrl]);
//     } else {
//       setExistingImageUrls([]);
//     }
//   }, [vehicle]);

//   const handleNewImageFiles = (files) => {
//     if (!files || files.length === 0) return;
//     const newFiles = Array.from(files);
//     setNewImageFiles(prev => [...prev, ...newFiles]);

//     // Generate previews
//     newFiles.forEach(file => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setNewImagePreviews(prev => [...prev, e.target.result]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleRemoveNewImage = (idx) => {
//     setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
//     setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
//   };

//   const handleRemoveExistingImage = (idx) => {
//     setExistingImageUrls(prev => prev.filter((_, i) => i !== idx));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     handleNewImageFiles(e.dataTransfer.files);
//   };

// const formatNumberWithCommas = (value) => {
//   if (!value && value !== 0) return '';
//   const num = Number(value.toString().replace(/,/g, ''));
//   if (isNaN(num)) return '';
//   return num.toLocaleString('en-US');
// };

//   const handleChange = (field) => (e) =>
//     setForm((prev) => ({ ...prev, [field]: e.target.value }));

//   const handleEditVehicle = async () => {
//     setSaving(true);
//     try {
//       let finalImageUrls = [...existingImageUrls];

//       // Upload new images if any
//       if (newImageFiles.length > 0) {
//         const uploadResult = await uploadImagesToCloudinary(newImageFiles);
//         const resultData = uploadResult?.data || uploadResult;
//         let newUrls = [];
//         if (resultData.imageUrls && Array.isArray(resultData.imageUrls)) {
//           newUrls = resultData.imageUrls;
//         } else if (resultData.imageUrl) {
//           newUrls = [resultData.imageUrl];
//         } else if (resultData.urls && Array.isArray(resultData.urls)) {
//           newUrls = resultData.urls;
//         } else if (Array.isArray(resultData)) {
//           newUrls = resultData;
//         }
//         finalImageUrls = [...finalImageUrls, ...newUrls];
//       }

//       const carData = {
//         name: form.carName,
//         description: form.description,
//         basePrice: Number(form.vehiclePrice),
//         variant: form.variant,
//         numberOfUnits: Number(form.numberOfUnits),
//         availability: form.availability,
//         specs: {
//           engine: form.engineSpec,
//           transmission: form.transmissionSpec,
//         },
//         // Send as array of objects with 'url' property
//         images: finalImageUrls.map(url => ({ url })),
//       };

//       await carApi.updateCar(vehicle.id, carData);
//       await fetchVehicles();
//       Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle updated successfully!' });
//       onBack();
//     } catch (e) {
//       Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to update vehicle' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-8 w-full">
//       <button
//         onClick={onBack}
//         className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
//       >
//         <ArrowLeft size={15} />
//         Go back
//       </button>
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Vehicle Details</h1>

//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div>
//             <p className="font-semibold text-gray-900">Edit Vehicle Details</p>
//             <p className="text-sm text-gray-400 mt-0.5">Change the Input details below</p>
//           </div>
//         </div>

//         {/* Upload Images Section */}
//         <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
//           <div className="w-full">
//             <p className="text-sm font-medium text-gray-700">Vehicle Images</p>
//           </div>
//           <div className="w-full">
//             {/* Existing Images */}
//             {existingImageUrls.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm text-gray-500 mb-2">Current Images</p>
//                 <div className="flex flex-wrap gap-4">
//                   {existingImageUrls.map((url, idx) => (
//                     <div key={`existing-${idx}`} className="relative group">
//                       <img src={url} alt={`Existing ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingImage(idx)}
//                         className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
//                         title="Remove image"
//                       >
//                         <span className="leading-none">×</span>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* New Images Upload Area */}
//             <p className="text-sm text-gray-500 mb-2">Add more images (optional)</p>
//             <div
//               className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
//                 dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
//               }`}
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={handleDrop}
//             >
//               {newImagePreviews.length > 0 ? (
//                 <div className="flex flex-wrap gap-4">
//                   {newImagePreviews.map((src, idx) => (
//                     <div key={`new-${idx}`} className="relative group">
//                       <img src={src} alt={`New Preview ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveNewImage(idx)}
//                         className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
//                         title="Remove image"
//                       >
//                         <span className="leading-none">×</span>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <>
//                   <UploadCloud size={32} className="text-blue-400" />
//                   <p className="text-sm text-gray-500">
//                     <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
//                 </>
//               )}
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={(e) => handleNewImageFiles(e.target.files)}
//             />
//           </div>
//         </div>

//         {/* Car Details Row */}
//         <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
//           <div className="w-full">
//             <p className="text-sm font-medium text-gray-700">Input Car Details</p>
//           </div>
//           <div className="flex flex-col gap-4 w-full">
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter car name"
//                 value={form.carName}
//                 onChange={handleChange('carName')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
//               />
//             </div>
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
//               <textarea
//                 placeholder="Enter Message..."
//                 rows={4}
//                 value={form.description}
//                 onChange={handleChange('description')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
//               />
//             </div>
//             <input
//   type="text"
//   placeholder="Enter amount"
//   value={form.vehiclePrice ? formatNumberWithCommas(form.vehiclePrice) : ''}
//   onChange={(e) => {
//     const raw = e.target.value.replace(/,/g, '');
//     if (raw === '' || /^\d+$/.test(raw)) {
//       setForm(prev => ({ ...prev, vehiclePrice: raw }));
//     }
//   }}
//   className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
// />
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
//               <input
//                 type="text"
//                 placeholder="Enter car variant"
//                 value={form.variant}
//                 onChange={handleChange('variant')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
//               />
//             </div>
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
//               <input
//                 type="number"
//                 min="1"
//                 placeholder="Enter number of units"
//                 value={form.numberOfUnits}
//                 onChange={handleChange('numberOfUnits')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Car Specifications Row */}
//         <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
//           <div>
//             <p className="text-sm font-medium text-gray-700">Input Car Specifications</p>
//           </div>
//           <div className="flex flex-col gap-4 w-full">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Engine Specification</label>
//               <textarea
//                 placeholder="Enter Message..."
//                 rows={4}
//                 value={form.engineSpec}
//                 onChange={handleChange('engineSpec')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Specification</label>
//               <textarea
//                 placeholder="Enter Message..."
//                 rows={4}
//                 value={form.transmissionSpec}
//                 onChange={handleChange('transmissionSpec')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Stock Availability</label>
//               <select
//                 value={form.availability || ''}
//                 onChange={handleChange('availability')}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
//               >
//                 <option value="">Select availability</option>
//                 <option value="AVAILABLE">Available</option>
//                 <option value="NOT_AVAILABLE">Not Available</option>
//                 <option value="COMING_SOON">Coming Soon</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className='flex w-full justify-end'>
//           <button
//             className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
//             onClick={handleEditVehicle}
//             disabled={saving}
//           >
//             {saving && (
//               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//               </svg>
//             )}
//             Save Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------- Main CarManagement Component ----------
// const CarManagement = () => {
//   const { inventory, addStock, removeStock, setStock } = useCarContext();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState(null);
//   const [search, setSearch] = useState('');
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [pageSizeOpen, setPageSizeOpen] = useState(false);

//   const fetchVehicles = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await carApi.getCars();
//       if (Array.isArray(response?.data)) {
//         setVehicles(response.data);
//       } else {
//         setVehicles([]);
//       }
//     } catch (err) {
//       setError('Failed to load vehicles');
//       setVehicles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   if (showAddForm) {
//     return <AddVehicleForm onBack={() => setShowAddForm(false)} fetchVehicles={fetchVehicles} />;
//   }

//   if (editingVehicle) {
//     return <EditVehicleForm vehicle={editingVehicle} onBack={() => setEditingVehicle(null)} fetchVehicles={fetchVehicles} />;
//   }

//   const filtered = vehicles.filter((v) =>
//     v.name && v.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalEntries = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
//   const safePage = Math.min(page, totalPages);
//   const startIdx = (safePage - 1) * pageSize;
//   const pageItems = filtered.slice(startIdx, startIdx + pageSize);

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const handleDelete = async (vehicleId) => {
//   // 1. Confirmation dialog
//   const confirmResult = await Swal.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//     confirmButtonText: 'Yes, delete it!'
//   });

//   if (!confirmResult.isConfirmed) return;

//   // 2. Show loading spinner
//   Swal.fire({
//     title: 'Deleting...',
//     html: 'Please wait while we delete the vehicle',
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     }
//   });

//   try {
//     await carApi.deleteCar(vehicleId);
    
//     // 3. Success feedback
//     await Swal.fire({
//       icon: 'success',
//       title: 'Deleted!',
//       text: 'Vehicle has been deleted.',
//       timer: 1500,
//       showConfirmButton: false
//     });

//     await fetchVehicles(); // refresh list
//   } catch (e) {
//     // 4. Error feedback
//     Swal.fire({
//       icon: 'error',
//       title: 'Failed',
//       text: e.message || 'Failed to delete vehicle'
//     });
//   }
// };

//   return (
//     <div className="p-4 sm:p-6 md:p-8 w-full">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Effortlessly control vehicle details, pricing, listings, and media in one centralized dashboard.
//           </p>
//         </div>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
//         >
//           <Plus size={16} />
//           Add New Vehicle
//         </button>
//       </div>

//       {/* Card Container */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         {/* Table Header */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <p className="font-semibold text-gray-900">Recent Cheque Items</p>
//             <p className="text-sm text-gray-400 mt-0.5">Latest processed cheques across all batches</p>
//           </div>
//           <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
//             <div className="relative w-full sm:w-auto">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search car names..."
//                 value={search}
//                 onChange={handleSearch}
//                 className="border border-gray-200 rounded-sm pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 w-full sm:w-56"
//               />
//             </div>
//             <div className="flex flex-row gap-3 w-full sm:w-auto">
//               <button className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
//                 <Download size={15} />
//                 Download
//               </button>
//               <div className="relative w-full sm:w-auto">
//                 <button
//                   onClick={() => setShowDatePicker((o) => !o)}
//                   className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
//                 >
//                   <CalendarDays size={15} />
//                   Custom Date
//                 </button>
//                 <DateRangePicker
//                   isOpen={showDatePicker}
//                   onClose={() => setShowDatePicker(false)}
//                   onApply={(range) => setDateRange(range)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Vehicle Cards */}
//         <div className="flex flex-col gap-4">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <img src="/empty-cars.svg" alt="Loading vehicles" className="w-32 h-32 mb-6 opacity-70 animate-pulse" />
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">Loading vehicles...</h2>
//               <p className="text-gray-500 mb-4">Please wait while we fetch your inventory.</p>
//             </div>
//           ) : pageItems.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <img src="/empty-cars.svg" alt="No vehicles" className="w-32 h-32 mb-6 opacity-70" />
//               <h2 className="text-lg font-semibold text-gray-700 mb-2">No vehicles found</h2>
//               <p className="text-gray-500 mb-4">You haven't added any cars yet. Start by adding your first vehicle to manage inventory, pricing, and details.</p>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
//               >
//                 <Plus size={18} className="inline-block mr-2" /> Add New Vehicle
//               </button>
//             </div>
//           ) : (
//             pageItems.map((vehicle) => {
//               const status = statusConfig[vehicle.availability] || statusConfig['AVAILABLE'];
//               // Determine image URL to display
//               let imageUrl = '/empty-cars.svg';
//               if (vehicle.primaryImageUrl) {
//                 imageUrl = vehicle.primaryImageUrl;
//               } else if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images[0]) {
//                 imageUrl = vehicle.images[0].url;
//               } else if (vehicle.imageUrls && Array.isArray(vehicle.imageUrls) && vehicle.imageUrls[0]) {
//                 imageUrl = vehicle.imageUrls[0];
//               }
//               return (
//                 <div key={vehicle.id} className="border border-gray-200 rounded-xl overflow-hidden">
//                   {/* Card Top */}
//                   <div className="flex flex-col md:flex-row gap-5 p-5 w-full">
//                     {/* Image */}
//                     <div className="w-full md:w-auto flex-shrink-0">
//                       <img
//                         src={imageUrl}
//                         alt={vehicle.name}
//                         className="w-full md:w-44 h-32 object-cover rounded-lg"
//                       />
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0 w-full">
//                       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
//                         <h3 className="text-lg font-bold text-gray-900 break-words whitespace-normal w-full">{vehicle.name}</h3>
//                         <div className="flex items-center gap-1.5 flex-shrink-0">
//                           <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
//                           <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-1 leading-relaxed w-full">
//                         {vehicle.description}
//                       </p>

//                       {/* Specs Grid */}
//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 w-full">
//                         <div className="flex flex-col w-full">
//                           <p className="text-sm text-gray-400">Base Price</p>
//                           <p className="text-sm font-bold text-gray-900">
//                             ₦{Number(vehicle.basePrice).toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="flex flex-col w-full">
//                           <p className="text-sm text-gray-400">Variant</p>
//                           <p className="text-sm font-bold text-gray-900">
//                             {vehicle.variant || '-'}
//                           </p>
//                         </div>
//                         <div className="flex flex-col w-full">
//                           <p className="text-sm text-gray-400">Engine</p>
//                           <p className="text-sm font-bold text-gray-900">
//                             {vehicle.specs?.engine || '-'}
//                           </p>
//                         </div>
//                         <div className="flex flex-col w-full">
//                           <p className="text-sm text-gray-400">Transmission</p>
//                           <p className="text-sm font-bold text-gray-900">
//                             {vehicle.specs?.transmission || '-'}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Inventory Controls */}
//                       <div className="flex flex-col md:flex-row items-start gap-3 mt-4 w-full">
//                         <p className="text-sm text-gray-400 font-medium text-left">Inventory:</p>
//                         <div className="flex items-center gap-2 w-full">
//                           <button
//                             onClick={() => removeStock(vehicle.id)}
//                             className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-red-500 transition-colors"
//                             title="Remove 1 unit"
//                           >
//                             <Minus size={13} />
//                           </button>
//                           <input
//                             type="number"
//                             min="0"
//                             value={inventory[vehicle.id] ?? 0}
//                             onChange={(e) => setStock(vehicle.id, e.target.value)}
//                             className="w-16 sm:w-20 md:w-16 text-left border border-gray-200 rounded-md py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-400"
//                           />
//                           <button
//                             onClick={() => addStock(vehicle.id)}
//                             className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-green-50 hover:border-green-300 text-gray-500 hover:text-green-600 transition-colors"
//                             title="Add 1 unit"
//                           >
//                             <Plus size={13} />
//                           </button>
//                           <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-left ${
//                             (inventory[vehicle.id] ?? 0) === 0
//                               ? 'bg-red-100 text-red-600'
//                               : (inventory[vehicle.id] ?? 0) <= 3
//                               ? 'bg-yellow-100 text-yellow-700'
//                               : 'bg-green-100 text-green-700'
//                           }`}>
//                             {(inventory[vehicle.id] ?? 0) === 0 ? 'Out of stock' : `${inventory[vehicle.id] ?? 0} in stock`}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Actions */}
//                   <div className="border-t border-gray-100 px-5 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4 w-full">
//                     <button
//                       onClick={async () => {
//                         try {
//                           const response = await carApi.getCar(vehicle.id);
//                           setEditingVehicle(response.data);
//                         } catch (e) {
//                           alert('Failed to fetch vehicle');
//                         }
//                       }}
//                       className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
//                     >
//                       <Pencil size={14} />
//                       Edit Vehicle Details
//                     </button>
//                     <button
//                       className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
//                       onClick={() => handleDelete(vehicle.id)}
//                     >
//                       <Trash2 size={14} />
//                       Delete Vehicle
//                     </button>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
//           <p className="text-sm text-gray-500">
//             Showing {totalEntries === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, totalEntries)} of {totalEntries} entries
//           </p>
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-500">Show</span>
//             <div className="relative">
//               <button
//                 onClick={() => setPageSizeOpen((o) => !o)}
//                 className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 {pageSize}
//                 <ChevronDown size={13} />
//               </button>
//               {pageSizeOpen && (
//                 <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-md shadow-md z-10 min-w-full">
//                   {PAGE_SIZES.map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
//                       className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${s === pageSize ? 'text-blue-500 font-medium' : 'text-gray-700'}`}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <span className="text-sm text-gray-500">entries</span>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={safePage === 1}
//                 className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft size={14} />
//               </button>
//               <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-sm text-gray-700 font-medium bg-white">
//                 {safePage}
//               </span>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={safePage === totalPages}
//                 className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarManagement;







import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { uploadImagesToCloudinary } from '../../api/upload';
import {
  Plus, Search, Pencil, Trash2, Download, CalendarDays, ChevronDown,
  ChevronLeft, ChevronRight, ArrowLeft, UploadCloud, Minus, FileSpreadsheet
} from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { useCarContext } from '../../context/CarContext';
import * as carApi from '../../api/cars';

const PAGE_SIZES = [10, 20, 50];

const statusConfig = {
  AVAILABLE: { dot: 'bg-green-500', text: 'text-green-500', label: 'Available' },
  NOT_AVAILABLE: { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
  'NOT AVAILABLE': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
  'Not-Available': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
  'Not Available': { dot: 'bg-red-500', text: 'text-red-500', label: 'Not Available' },
  'Coming Soon': { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
  COMING_SOON: { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
  'COMING SOON': { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Coming Soon' },
};

// ---------- Helper to format numbers with commas ----------
const formatNumberWithCommas = (value) => {
  if (!value && value !== 0) return '';
  const num = Number(value.toString().replace(/,/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
};

// ---------- Map availability string to enum ----------
// const mapAvailability = (avail) => {
//   if (!avail) return '';
//   const a = avail.trim().toLowerCase();
//   if (a.includes('available')) return 'AVAILABLE';
//   if (a.includes('not available')) return 'NOT_AVAILABLE';
//   if (a.includes('coming soon')) return 'COMING_SOON';
//   return ''; // default empty, user will need to select manually later
// };


const mapAvailability = (avail) => {
  if (!avail) return '';
  const a = avail.trim().toLowerCase().replace(/[^a-z]/g, ''); // remove non-letters
  if (a.includes('available')) {
    // Check for negative forms first
    if (a.includes('notavailable') || a.includes('unavailable')) return 'NOT_AVAILABLE';
    return 'AVAILABLE';
  }
  if (a.includes('comingsoon')) return 'COMING_SOON';
  // fallback to manual check with original string
  if (avail.toLowerCase().includes('not available') || avail.toLowerCase().includes('not-available') || avail.toLowerCase().includes('not_available')) return 'NOT_AVAILABLE';
  if (avail.toLowerCase().includes('coming soon') || avail.toLowerCase().includes('coming-soon') || avail.toLowerCase().includes('coming_soon')) return 'COMING_SOON';
  return ''; // will default to 'AVAILABLE' in the import logic
};

// ========== IMPORT VEHICLES COMPONENT ==========
const ImportVehicles = ({ onBack, fetchVehicles }) => {
  const [drag, setDrag] = useState(false);
  const [upFile, setUpFile] = useState(null);
  const [upData, setUpData] = useState(null);
  const [uping, setUping] = useState(false);
  const [upProg, setUpProg] = useState(0);
  const fileInputRef = useRef(null);

  // Excel parser
  const parseXl = (file) => new Promise((ok, no) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        let headerRow = -1;
        for (let i = 0; i < Math.min(5, raw.length); i++) {
          const row = raw[i];
          if (row && row.some(cell => cell && cell.toString().toLowerCase().includes('model'))) {
            headerRow = i;
            break;
          }
        }
        if (headerRow < 0) headerRow = 1;
        const vehicles = raw.slice(headerRow + 1)
          .filter(row => row[1] && row[1].toString().trim())
          .map((row, idx) => {
            const sn = row[0];
            const name = row[1] ? row[1].toString().trim() : '';
            const engine = row[2] ? row[2].toString().trim() : '';
            const transmission = row[3] ? row[3].toString().trim() : '';
            const units = row[4] ? Number(row[4]) : 0;
            const price = row[5] ? Number(row[5].toString().replace(/[^0-9.]/g, '')) : 0;
            const availability = row[6] ? row[6].toString().trim() : '';
            const specs = row[7] ? row[7].toString().trim() : '';

            return {
              id: `temp-${Date.now()}-${idx}`,
              name,
              engine,
              transmission,
              units: isNaN(units) ? 0 : units,
              price: isNaN(price) ? 0 : price,
              availability,
              specs,
            };
          });
        ok(vehicles);
      } catch (err) {
        no(err);
      }
    };
    reader.onerror = no;
    reader.readAsArrayBuffer(file);
  });

  const pickFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      Swal.fire({ icon: 'error', title: 'Invalid file', text: 'Please upload an Excel or CSV file.' });
      return;
    }
    setUpFile(file);
    try {
      const data = await parseXl(file);
      setUpData(data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Parse error', text: 'Failed to parse the file. Check the format.' });
      setUpFile(null);
    }
  };

  const doImport = async () => {
    if (!upData || upData.length === 0) return;
    setUping(true);
    setUpProg(0);

    const total = upData.length;
    let successCount = 0;
    const errors = [];

    for (let i = 0; i < total; i++) {
      const item = upData[i];
      try {
        const carData = {
          name: item.name,
          description: item.specs || `${item.engine} - ${item.transmission}`,
          basePrice: item.price,
          variant: '',
          numberOfUnits: item.units,
          availability: mapAvailability(item.availability) || 'AVAILABLE',
          specs: {
            engine: item.engine,
            transmission: item.transmission,
          },
          images: [],
        };
        await carApi.createCar(carData);
        successCount++;
      } catch (err) {
        errors.push(`Row ${i+1} (${item.name}): ${err.message || 'Failed'}`);
      }
      setUpProg(Math.round(((i + 1) / total) * 100));
    }

    setUping(false);
    if (errors.length === 0) {
      Swal.fire({ icon: 'success', title: 'Import complete', text: `${successCount} vehicles imported.` });
      await fetchVehicles();
      onBack();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Import completed with errors',
        html: `${successCount} succeeded, ${errors.length} failed.<br/>${errors.slice(0, 3).join('<br/>')}${errors.length > 3 ? '...' : ''}`,
      });
      await fetchVehicles();
      onBack();
    }
  };

  return (
    <div className="p-8 w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        Go back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Import Vehicles from Excel</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {!upData ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
              drag ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileSpreadsheet size={48} className="text-blue-400" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">Accepts .xlsx, .xls, or .csv</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>
        ) : (
          <>
            {upFile && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <FileSpreadsheet size={20} className="text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{upFile.name}</p>
                  <p className="text-xs text-gray-400">{(upFile.size / 1024).toFixed(1)} KB • {upData.length} vehicles found</p>
                </div>
                <button
                  onClick={() => { setUpData(null); setUpFile(null); }}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Change file
                </button>
              </div>
            )}

            {uping && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Importing...</span>
                  <span>{upProg}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${upProg}%` }}></div>
                </div>
              </div>
            )}

            <div className="max-h-96 overflow-auto border border-gray-200 rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-left">Engine</th>
                    <th className="px-4 py-2 text-left">Trans.</th>
                    <th className="px-4 py-2 text-left">Units</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {upData.map((v, idx) => (
                    <tr key={v.id} className="border-t border-gray-100">
                      <td className="px-4 py-2 font-medium">{v.name}</td>
                      <td className="px-4 py-2">{v.engine}</td>
                      <td className="px-4 py-2">{v.transmission}</td>
                      <td className="px-4 py-2">{v.units}</td>
                      <td className="px-4 py-2">₦{v.price.toLocaleString()}</td>
                      <td className="px-4 py-2">{v.availability || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => { setUpData(null); setUpFile(null); }}
                disabled={uping}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
                onClick={doImport}
                disabled={uping}
              >
                {uping ? 'Importing...' : `Import ${upData.length} Vehicles`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ========== ADD VEHICLE FORM (unchanged) ==========
const AddVehicleForm = ({ onBack, fetchVehicles }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    carName: '',
    description: '',
    modelYear: '',
    basePrice: '',
    variant: '',
    numberOfUnits: '',
    engineSpec: '',
    transmissionSpec: 'Manual',
    availability: '',
    fuelTypeSpec: '',
  });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!form.carName.trim()) errors.carName = 'Car name is required.';
    if (!form.description.trim()) errors.description = 'Description is required.';
    if (!form.basePrice || isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0.01)
      errors.basePrice = 'Base price must be a number greater than 0.01.';
    if (!form.variant.trim()) errors.variant = 'Variant is required.';
    if (!form.numberOfUnits || isNaN(Number(form.numberOfUnits)) || Number(form.numberOfUnits) < 1)
      errors.numberOfUnits = 'Number of units must be at least 1.';
    if (!form.engineSpec.trim()) errors.engineSpec = 'Engine specification is required.';
    if (!form.transmissionSpec.trim()) errors.transmissionSpec = 'Transmission is required.';
    if (!form.availability) errors.availability = 'Availability is required.';
    return errors;
  };

  const handleNewImageFiles = (files) => {
    if (!files || files.length === 0) return;
    const newImages = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({ src: e.target.result, file });
        if (newImages.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      Array.from(fileInputRef.current.files).forEach((file, i) => {
        if (i !== idx) dt.items.add(file);
      });
      fileInputRef.current.files = dt.files;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleNewImageFiles(e.dataTransfer.files);
  };

  const handleAddVehicle = async () => {
    setFormError('');
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError('Please correct the errors below.');
      return;
    }
    setSaving(true);
    try {
      let imageUrls = [];
      if (imagePreviews.length > 0 && fileInputRef.current && fileInputRef.current.files.length > 0) {
        const filesToUpload = imagePreviews.map(img => img.file);
        const uploadResult = await uploadImagesToCloudinary(filesToUpload);
        const resultData = uploadResult?.data || uploadResult;
        if (resultData.imageUrls && Array.isArray(resultData.imageUrls)) {
          imageUrls = resultData.imageUrls;
        } else if (resultData.imageUrl) {
          imageUrls = [resultData.imageUrl];
        } else if (resultData.urls && Array.isArray(resultData.urls)) {
          imageUrls = resultData.urls;
        } else if (Array.isArray(resultData)) {
          imageUrls = resultData;
        }
      }

      if (!imageUrls || imageUrls.length === 0 || !imageUrls[0]) {
        setFormError('Image upload failed. Please try again.');
        setSaving(false);
        return;
      }

      const carData = {
        name: form.carName,
        description: form.description,
        basePrice: Number(form.basePrice),
        variant: form.variant,
        numberOfUnits: Number(form.numberOfUnits),
        availability: form.availability,
        specs: {
          engine: form.engineSpec,
          transmission: form.transmissionSpec,
        },
        images: imageUrls.map(url => ({ url })),
      };

      await carApi.createCar(carData);
      await fetchVehicles();
      Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle added successfully!' });
      onBack();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to add vehicle' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="p-8 w-full">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {formError}
        </div>
      )}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        Go back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Add New Vehicle</p>
            <p className="text-sm text-gray-400 mt-0.5">Input the details below to add new vehicles</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {/* Upload Images Row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
            <div className="w-full">
              <p className="text-sm font-medium text-gray-700">Upload Vehicle Images</p>
            </div>
            <div className="w-full">
              <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop multiple images</p>
              <div
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {imagePreviews.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img.src} alt={`Preview ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleRemoveImage(idx); }}
                          title="Remove image"
                          className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
                        >
                          <span className="leading-none">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-blue-400" />
                    <p className="text-sm text-gray-500">
                      <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleNewImageFiles(e.target.files)}
              />
            </div>
          </div>
          {/* Car Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
            <div>
              <p className="text-sm font-medium text-gray-700">Input Car Details</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Model</label>
                <input
                  type="text"
                  placeholder="Enter car name"
                  value={form.carName}
                  onChange={handleChange('carName')}
                  className={`w-full border ${fieldErrors.carName ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                />
                {fieldErrors.carName && <p className="text-xs text-red-500 mt-1">{fieldErrors.carName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.description}
                  onChange={handleChange('description')}
                  className={`w-full border ${fieldErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none`}
                />
                {fieldErrors.description && <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={form.basePrice ? formatNumberWithCommas(form.basePrice) : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    if (raw === '' || /^\d+$/.test(raw)) {
                      setForm(prev => ({ ...prev, basePrice: raw }));
                      setFieldErrors(prev => ({ ...prev, basePrice: undefined }));
                    }
                  }}
                  className={`w-full border ${fieldErrors.basePrice ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                />
                {fieldErrors.basePrice && <p className="text-xs text-red-500 mt-1">{fieldErrors.basePrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                <input
                  type="text"
                  placeholder="Enter car variant"
                  value={form.variant}
                  onChange={handleChange('variant')}
                  className={`w-full border ${fieldErrors.variant ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                />
                {fieldErrors.variant && <p className="text-xs text-red-500 mt-1">{fieldErrors.variant}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter number of units"
                  value={form.numberOfUnits}
                  onChange={handleChange('numberOfUnits')}
                  className={`w-full border ${fieldErrors.numberOfUnits ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                />
                {fieldErrors.numberOfUnits && <p className="text-xs text-red-500 mt-1">{fieldErrors.numberOfUnits}</p>}
              </div>
            </div>
          </div>
          {/* Car Specifications Row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
            <div>
              <p className="text-sm font-medium text-gray-700">Specifications</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.engineSpec}
                  onChange={handleChange('engineSpec')}
                  className={`w-full border ${fieldErrors.engineSpec ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none`}
                />
                {fieldErrors.engineSpec && <p className="text-xs text-red-500 mt-1">{fieldErrors.engineSpec}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  value={form.transmissionSpec}
                  onChange={handleChange('transmissionSpec')}
                  className={`w-full border ${fieldErrors.transmissionSpec ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                {fieldErrors.transmissionSpec && <p className="text-xs text-red-500 mt-1">{fieldErrors.transmissionSpec}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Availability</label>
                <select
                  value={form.availability || ''}
                  onChange={handleChange('availability')}
                  className={`w-full border ${fieldErrors.availability ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400`}
                >
                  <option value="">Select availability</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="NOT_AVAILABLE">Not Available</option>
                  <option value="COMING_SOON">Coming Soon</option>
                </select>
                {fieldErrors.availability && <p className="text-xs text-red-500 mt-1">{fieldErrors.availability}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end'>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            onClick={handleAddVehicle}
            disabled={saving}
          >
            {saving && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== EDIT VEHICLE FORM (unchanged) ==========
const EditVehicleForm = ({ vehicle, onBack, fetchVehicles }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [form, setForm] = useState({
    carName: '',
    description: '',
    vehiclePrice: '',
    variant: '',
    numberOfUnits: '',
    engineSpec: '',
    transmissionSpec: '',
    availability: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vehicle) return;
    setForm({
      carName: vehicle.name || '',
      description: vehicle.description || '',
      vehiclePrice: vehicle.basePrice || '',
      variant: vehicle.variant || '',
      numberOfUnits: vehicle.numberOfUnits || '',
      engineSpec: vehicle.specs?.engine || '',
      transmissionSpec: vehicle.specs?.transmission || '',
      availability: vehicle.availability || '',
    });
    if (vehicle.images && Array.isArray(vehicle.images)) {
      setExistingImageUrls(vehicle.images.map(img => img.url));
    } else if (vehicle.imageUrls && Array.isArray(vehicle.imageUrls)) {
      setExistingImageUrls(vehicle.imageUrls);
    } else if (vehicle.primaryImageUrl) {
      setExistingImageUrls([vehicle.primaryImageUrl]);
    } else {
      setExistingImageUrls([]);
    }
  }, [vehicle]);

  const handleNewImageFiles = (files) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setNewImageFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (idx) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleNewImageFiles(e.dataTransfer.files);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleEditVehicle = async () => {
    setSaving(true);
    try {
      let finalImageUrls = [...existingImageUrls];
      if (newImageFiles.length > 0) {
        const uploadResult = await uploadImagesToCloudinary(newImageFiles);
        const resultData = uploadResult?.data || uploadResult;
        let newUrls = [];
        if (resultData.imageUrls && Array.isArray(resultData.imageUrls)) {
          newUrls = resultData.imageUrls;
        } else if (resultData.imageUrl) {
          newUrls = [resultData.imageUrl];
        } else if (resultData.urls && Array.isArray(resultData.urls)) {
          newUrls = resultData.urls;
        } else if (Array.isArray(resultData)) {
          newUrls = resultData;
        }
        finalImageUrls = [...finalImageUrls, ...newUrls];
      }

      const carData = {
        name: form.carName,
        description: form.description,
        basePrice: Number(form.vehiclePrice),
        variant: form.variant,
        numberOfUnits: Number(form.numberOfUnits),
        availability: form.availability,
        specs: {
          engine: form.engineSpec,
          transmission: form.transmissionSpec,
        },
        images: finalImageUrls.map(url => ({ url })),
      };

      await carApi.updateCar(vehicle.id, carData);
      await fetchVehicles();
      Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle updated successfully!' });
      onBack();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to update vehicle' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        Go back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Vehicle Details</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Edit Vehicle Details</p>
            <p className="text-sm text-gray-400 mt-0.5">Change the Input details below</p>
          </div>
        </div>

        {/* Upload Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700">Vehicle Images</p>
          </div>
          <div className="w-full">
            {existingImageUrls.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Images</p>
                <div className="flex flex-wrap gap-4">
                  {existingImageUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group">
                      <img src={url} alt={`Existing ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
                        title="Remove image"
                      >
                        <span className="leading-none">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-2">Add more images (optional)</p>
            <div
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {newImagePreviews.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {newImagePreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative group">
                      <img src={src} alt={`New Preview ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 grid place-items-center bg-white/80 rounded-full shadow hover:bg-red-500 hover:text-white transition z-10"
                        title="Remove image"
                      >
                        <span className="leading-none">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <UploadCloud size={32} className="text-blue-400" />
                  <p className="text-sm text-gray-500">
                    <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleNewImageFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Car Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700">Input Car Details</p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
              <input
                type="text"
                placeholder="Enter car name"
                value={form.carName}
                onChange={handleChange('carName')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
              <textarea
                placeholder="Enter Message..."
                rows={4}
                value={form.description}
                onChange={handleChange('description')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <input
              type="text"
              placeholder="Enter amount"
              value={form.vehiclePrice ? formatNumberWithCommas(form.vehiclePrice) : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || /^\d+$/.test(raw)) {
                  setForm(prev => ({ ...prev, vehiclePrice: raw }));
                }
              }}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              <input
                type="text"
                placeholder="Enter car variant"
                value={form.variant}
                onChange={handleChange('variant')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
              <input
                type="number"
                min="1"
                placeholder="Enter number of units"
                value={form.numberOfUnits}
                onChange={handleChange('numberOfUnits')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Car Specifications Row */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700">Input Car Specifications</p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engine Specification</label>
              <textarea
                placeholder="Enter Message..."
                rows={4}
                value={form.engineSpec}
                onChange={handleChange('engineSpec')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Specification</label>
              <textarea
                placeholder="Enter Message..."
                rows={4}
                value={form.transmissionSpec}
                onChange={handleChange('transmissionSpec')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Availability</label>
              <select
                value={form.availability || ''}
                onChange={handleChange('availability')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
              >
                <option value="">Select availability</option>
                <option value="AVAILABLE">Available</option>
                <option value="NOT_AVAILABLE">Not Available</option>
                <option value="COMING_SOON">Coming Soon</option>
              </select>
            </div>
          </div>
        </div>

        <div className='flex w-full justify-end'>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            onClick={handleEditVehicle}
            disabled={saving}
          >
            {saving && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN CAR MANAGEMENT COMPONENT ==========
const CarManagement = () => {
  const { inventory, addStock, removeStock, setStock } = useCarContext();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [search, setSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  // New state for selection and download
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await carApi.getCars();
      if (Array.isArray(response?.data)) {
        setVehicles(response.data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      setError('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (showImportForm) {
    return <ImportVehicles onBack={() => setShowImportForm(false)} fetchVehicles={fetchVehicles} />;
  }

  if (showAddForm) {
    return <AddVehicleForm onBack={() => setShowAddForm(false)} fetchVehicles={fetchVehicles} />;
  }

  if (editingVehicle) {
    return <EditVehicleForm vehicle={editingVehicle} onBack={() => setEditingVehicle(null)} fetchVehicles={fetchVehicles} />;
  }

  const filtered = vehicles.filter((v) =>
    v.name && v.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (vehicleId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Deleting...',
      html: 'Please wait while we delete the vehicle',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await carApi.deleteCar(vehicleId);
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Vehicle has been deleted.',
        timer: 1500,
        showConfirmButton: false
      });
      await fetchVehicles();
      // Clear selection for deleted vehicle
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(vehicleId);
        return newSet;
      });
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: e.message || 'Failed to delete vehicle'
      });
    }
  };

  // ---------- Selection handlers ----------
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pageItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pageItems.map(v => v.id)));
    }
  };

  // ---------- Download handler ----------
  const downloadVehicles = (vehiclesToDownload, filename = 'vehicles.xlsx') => {
    if (vehiclesToDownload.length === 0) {
      Swal.fire({ icon: 'info', title: 'No vehicles', text: 'There are no vehicles to download.' });
      return;
    }

    const data = vehiclesToDownload.map(v => ({
      ID: v.id,
      Name: v.name,
      Description: v.description,
      'Base Price (NGN)': v.basePrice,
      Variant: v.variant,
      'Number of Units': v.numberOfUnits,
      Availability: v.availability,
      'Engine Spec': v.specs?.engine,
      'Transmission Spec': v.specs?.transmission,
      'Image Count': v.images?.length || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');
    XLSX.writeFile(wb, filename);
    setDownloadMenuOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Effortlessly control vehicle details, pricing, listings, and media in one centralized dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowImportForm(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <FileSpreadsheet size={16} />
            Import from Excel
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Table Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">Recent Cheque Items</p>
            <p className="text-sm text-gray-400 mt-0.5">Latest processed cheques across all batches</p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
            {/* Select All Checkbox */}
            {pageItems.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedIds.size === pageItems.length && pageItems.length > 0}
                  onChange={toggleSelectAll}
                />
                <span>Select All</span>
              </div>
            )}
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search car names..."
                value={search}
                onChange={handleSearch}
                className="border border-gray-200 rounded-sm pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 w-full sm:w-56"
              />
            </div>
            <div className="flex flex-row gap-3 w-full sm:w-auto">
              {/* Download Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDownloadMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                >
                  <Download size={15} />
                  Download
                </button>
                {downloadMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    <button
                      onClick={() => downloadVehicles(pageItems, 'filtered_vehicles.xlsx')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download All (Filtered)
                    </button>
                    <button
                      onClick={() => {
                        const selectedVehicles = vehicles.filter(v => selectedIds.has(v.id));
                        downloadVehicles(selectedVehicles, 'selected_vehicles.xlsx');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download Selected ({selectedIds.size})
                    </button>
                  </div>
                )}
              </div>
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowDatePicker((o) => !o)}
                  className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                >
                  <CalendarDays size={15} />
                  Custom Date
                </button>
                <DateRangePicker
                  isOpen={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onApply={(range) => setDateRange(range)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-cars.svg" alt="Loading vehicles" className="w-32 h-32 mb-6 opacity-70 animate-pulse" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Loading vehicles...</h2>
              <p className="text-gray-500 mb-4">Please wait while we fetch your inventory.</p>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-cars.svg" alt="No vehicles" className="w-32 h-32 mb-6 opacity-70" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No vehicles found</h2>
              <p className="text-gray-500 mb-4">You haven't added any cars yet. Start by adding your first vehicle to manage inventory, pricing, and details.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
              >
                <Plus size={18} className="inline-block mr-2" /> Add New Vehicle
              </button>
            </div>
          ) : (
            pageItems.map((vehicle) => {
              const status = statusConfig[vehicle.availability] || statusConfig['AVAILABLE'];
              let imageUrl = '/empty-cars.svg';
              if (vehicle.primaryImageUrl) {
                imageUrl = vehicle.primaryImageUrl;
              } else if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images[0]) {
                imageUrl = vehicle.images[0].url;
              } else if (vehicle.imageUrls && Array.isArray(vehicle.imageUrls) && vehicle.imageUrls[0]) {
                imageUrl = vehicle.imageUrls[0];
              }
              const isSelected = selectedIds.has(vehicle.id);

              return (
                <div key={vehicle.id} className={`border rounded-xl overflow-hidden transition-colors ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                  {/* Card Top */}
                  <div className="flex flex-col md:flex-row gap-5 p-5 w-full">
                    {/* Checkbox and Image */}
                    <div className="flex items-start gap-3 w-full md:w-auto">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => toggleSelect(vehicle.id)}
                      />
                      <div className="w-full md:w-44 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={vehicle.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                        <h3 className="text-lg font-bold text-gray-900 break-words whitespace-normal w-full">{vehicle.name}</h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed w-full">
                        {vehicle.description}
                      </p>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-sm text-gray-400">Base Price</p>
                          <p className="text-sm font-bold text-gray-900">
                            ₦{Number(vehicle.basePrice).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-sm text-gray-400">Variant</p>
                          <p className="text-sm font-bold text-gray-900">
                            {vehicle.variant || '-'}
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-sm text-gray-400">Engine</p>
                          <p className="text-sm font-bold text-gray-900">
                            {vehicle.specs?.engine || '-'}
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-sm text-gray-400">Transmission</p>
                          <p className="text-sm font-bold text-gray-900">
                            {vehicle.specs?.transmission || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Inventory Controls */}
                      <div className="flex flex-col md:flex-row items-start gap-3 mt-4 w-full">
                        <p className="text-sm text-gray-400 font-medium text-left">Inventory:</p>
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => removeStock(vehicle.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-red-500 transition-colors"
                            title="Remove 1 unit"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={inventory[vehicle.id] ?? 0}
                            onChange={(e) => setStock(vehicle.id, e.target.value)}
                            className="w-16 sm:w-20 md:w-16 text-left border border-gray-200 rounded-md py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-400"
                          />
                          <button
                            onClick={() => addStock(vehicle.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-green-50 hover:border-green-300 text-gray-500 hover:text-green-600 transition-colors"
                            title="Add 1 unit"
                          >
                            <Plus size={13} />
                          </button>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-left ${
                            (inventory[vehicle.id] ?? 0) === 0
                              ? 'bg-red-100 text-red-600'
                              : (inventory[vehicle.id] ?? 0) <= 3
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {(inventory[vehicle.id] ?? 0) === 0 ? 'Out of stock' : `${inventory[vehicle.id] ?? 0} in stock`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="border-t border-gray-100 px-5 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4 w-full">
                    <button
                      onClick={async () => {
                        try {
                          const response = await carApi.getCar(vehicle.id);
                          setEditingVehicle(response.data);
                        } catch (e) {
                          alert('Failed to fetch vehicle');
                        }
                      }}
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
                    >
                      <Pencil size={14} />
                      Edit Vehicle Details
                    </button>
                    <button
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 size={14} />
                      Delete Vehicle
                    </button>
                    {/* Single vehicle download button */}
                    <button
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
                      onClick={() => downloadVehicles([vehicle], `${vehicle.name}.xlsx`)}
                      title="Download this vehicle"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination (unchanged) */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {totalEntries === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Show</span>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((o) => !o)}
                className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {pageSize}
                <ChevronDown size={13} />
              </button>
              {pageSizeOpen && (
                <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-md shadow-md z-10 min-w-full">
                  {PAGE_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
                      className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${s === pageSize ? 'text-blue-500 font-medium' : 'text-gray-700'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">entries</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-sm text-gray-700 font-medium bg-white">
                {safePage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarManagement;
import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { uploadImagesToCloudinary } from '../../api/upload';
import { Plus, Search, Pencil, Trash2, Download, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, UploadCloud, Minus } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { useCarContext } from '../../context/CarContext';

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
    engineSpec: '',
    transmissionSpec: 'Manual',
    availability: '',
    fuelTypeSpec: '',
  });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.carName.trim()) errors.carName = 'Car name is required.';
    if (!form.description.trim()) errors.description = 'Description is required.';
    if (!form.basePrice || isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0.01) errors.basePrice = 'Base price must be a number greater than 0.01.';
    if (!form.variant.trim()) errors.variant = 'Variant is required.';
    if (!form.engineSpec.trim()) errors.engineSpec = 'Engine specification is required.';
    if (!form.transmissionSpec.trim()) errors.transmissionSpec = 'Transmission is required.';
    if (!form.availability) errors.availability = 'Availability is required.';
    // Optionally validate image
    // if (imagePreviews.length === 0) errors.images = 'At least one image is required.';
    return errors;
  };

  // Handle multiple image files
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

  // Remove image from preview and input
  const handleRemoveImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) {
      // Remove file from input field
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
    try {
      let imageUrls = [];
      if (imagePreviews.length > 0 && fileInputRef.current && fileInputRef.current.files.length > 0) {
        // Only upload files that are still in imagePreviews
        const filesToUpload = imagePreviews.map(img => img.file);
        const uploadResult = await uploadImagesToCloudinary(filesToUpload);
        // Support both single and multiple image upload responses
        if (uploadResult.imageUrls && Array.isArray(uploadResult.imageUrls)) {
          imageUrls = uploadResult.imageUrls;
        } else if (uploadResult.imageUrl) {
          imageUrls = [uploadResult.imageUrl];
        } else if (uploadResult.urls && Array.isArray(uploadResult.urls)) {
          imageUrls = uploadResult.urls;
        } else if (Array.isArray(uploadResult)) {
          imageUrls = uploadResult;
        }
      }
      const carData = {
        name: form.carName,
        description: form.description,
        basePrice: Number(form.basePrice),
        variant: form.variant,
        availability: form.availability,
        specs: {
          engine: form.engineSpec,
          transmission: form.transmissionSpec,
        },
        images: imageUrls && imageUrls.length > 0 ? imageUrls.map(url => ({ url })) : [],
      };
      await carApi.createCar(carData);
      await fetchVehicles();
      Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle added successfully!' });
      onBack();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to add vehicle' });
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
      {/* Back + Title */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        Go back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h1>
      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Card Header */}
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
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow group-hover:opacity-100 opacity-80 hover:bg-red-500 hover:text-white transition-opacity z-10"
                          title="Remove image"
                        >
                          <span style={{fontWeight:'bold',fontSize:'1.1em'}}>×</span>
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
                  value={form.basePrice}
                  onChange={handleChange('basePrice')}
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
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            onClick={handleAddVehicle}
          >
            Save Details
          </button>
          </div>
      </div>
    </div>
  );
}

const EditVehicleForm = ({ vehicle, onBack, fetchVehicles }) => {
  const fileInputRef = useRef(null);
  const changeInputRefs = useRef([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [form, setForm] = useState({
    carName: '',
    description: '',
    vehiclePrice: '',
    variant: '',
    engineSpec: '',
    transmissionSpec: '',
  });

  useEffect(() => {
    if (!vehicle) return;
    setForm({
      carName: vehicle.name || '',
      description: vehicle.description || '',
      vehiclePrice: vehicle.basePrice || vehicle.basePrice || '',
      variant: vehicle.variant || '',
      engineSpec: vehicle.specs?.engine || vehicle.specification || '',
      transmissionSpec: vehicle.specs?.transmission || vehicle.transmission || '',
    });
    if (vehicle.images?.length > 0) {
      setUploadedImages(vehicle.images.map(img => img.url || img));
    } else if (vehicle.image) {
      setUploadedImages([vehicle.image]);
    } else {
      setUploadedImages([]);
    }
  }, [vehicle]);

  const handleNewImageFiles = (files) => {
    if (!files || files.length === 0) return;
    const newImages = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChangeImageFile = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setUploadedImages((prev) =>
        prev.map((img, i) => (i === idx ? e.target.result : img))
      );
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (idx) =>
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleNewImageFiles(e.dataTransfer.files);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Edit vehicle handler
  const handleEditVehicle = async () => {
    try {
      let imageUrls = [];
      if (uploadedImages.length > 0 && fileInputRef.current && fileInputRef.current.files.length > 0) {
        const uploadResult = await uploadImagesToCloudinary(fileInputRef.current.files);
        // Support both single and multiple image upload responses
        if (uploadResult.imageUrls && Array.isArray(uploadResult.imageUrls)) {
          imageUrls = uploadResult.imageUrls;
        } else if (uploadResult.imageUrl) {
          imageUrls = [uploadResult.imageUrl];
        } else if (uploadResult.urls && Array.isArray(uploadResult.urls)) {
          imageUrls = uploadResult.urls;
        } else if (Array.isArray(uploadResult)) {
          imageUrls = uploadResult;
        }
      } else {
        imageUrls = uploadedImages;
      }
      const carData = {
        name: form.carName,
        description: form.description,
        basePrice: form.vehiclePrice,
        variant: form.variant,
        status: form.stockAvailability,
        specs: {
          engine: form.engineSpec,
          transmission: form.transmissionSpec,
        },
        images: imageUrls && imageUrls.length > 0 ? imageUrls.map(url => ({ url })) : [],
      };
      await carApi.updateCar(vehicle.id, carData);
      await fetchVehicles();
      Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle updated successfully!' });
      onBack();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Failed', text: e.message || 'Failed to update vehicle' });
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
              {uploadedImages.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {uploadedImages.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="max-h-40 rounded-lg object-contain" />
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
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            onClick={handleEditVehicle}
          >
            Save Details
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Upload Image Row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
            <div>
              <p className="text-sm font-medium text-gray-700">Upload Vehicle Image</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Click to upload more images</p>
              <div
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <UploadCloud size={32} className="text-blue-400" />
                <p className="text-sm text-gray-500">
                  <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleNewImageFile(e.target.files[0])}
              />

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images</p>
                  <div className="flex flex-wrap gap-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <img
                          src={img}
                          alt={`Vehicle ${idx + 1}`}
                          className="w-40 h-28 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => changeInputRefs.current[idx]?.click()}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Change Image
                        </button>
                        <button
                          onClick={() => handleDeleteImage(idx)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete Image
                        </button>
                        <input
                          ref={(el) => (changeInputRefs.current[idx] = el)}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleChangeImageFile(idx, e.target.files[0])}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Car Details Row */}
          {/* <div className="grid grid-cols-[200px_1fr] gap-8 py-6"> */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
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
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={form.vehiclePrice}
                  onChange={handleChange('vehiclePrice')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
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
            </div>
          </div>

          {/* Car Specifications Row */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-8 py-6 w-full">
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
        </div>
      </div>
  );
};

import * as carApi from '../../api/cars';

// Fetch a single car by ID
async function fetchCarById(carId) {
  try {
    const car = await carApi.getCar(carId);
    return car;
  } catch (e) {
    alert(e.message || 'Failed to fetch car');
    return null;
  }
}

// Update a car by ID
async function updateCarById(carId, carData) {
  try {
    const updated = await carApi.updateCar(carId, carData);
    return updated;
  } catch (e) {
    alert(e.message || 'Failed to update car');
    return null;
  }
}

// Delete a car by ID
async function deleteCarById(carId) {
  try {
    await carApi.deleteCar(carId);
    return true;
  } catch (e) {
    alert(e.message || 'Failed to delete car');
    return false;
  }
}

const CarManagement = () => {
  const { inventory, addStock, removeStock, setStock } = useCarContext();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [search, setSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  // Make fetchVehicles accessible in component scope
  async function fetchVehicles() {
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
  }
  useEffect(() => {
    fetchVehicles();
  }, []);

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

  return (
    // <div className="p-8 w-full">
    <div className="p-4 sm:p-6 md:p-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Effortlessly control vehicle details, pricing, listings, and media in one centralized dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          Add New Vehicle
        </button>
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
              <button className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                <Download size={15} />
                Download
              </button>
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
              return (
                <div key={vehicle.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Card Top */}
                  <div className="flex flex-col md:flex-row gap-5 p-5 w-full">
                    {/* Image */}
                    <div className="w-full md:w-auto flex-shrink-0">
                      <img
                        src={vehicle.images?.[0]?.url || '/empty-cars.svg'}
                        alt={vehicle.name}
                        className="w-full md:w-44 h-32 object-cover rounded-lg"
                      />
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

  {/* <div className="flex flex-col w-full">
    <p className="text-sm text-gray-400">Fuel Type</p>
    <p className="text-sm font-bold text-gray-900">
      {vehicle.specs?.fuelType || '-'}
    </p>
  </div> */}

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
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this vehicle?')) {
                          const success = await deleteCarById(vehicle.id);
                          if (success) {
                            Swal.fire({ icon: 'success', title: 'Success', text: 'Vehicle deleted successfully!' });
                            await fetchVehicles();
                          } else {
                            Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to delete vehicle' });
                          }
                        }
                      }}
                    >
                      <Trash2 size={14} />
                      DeleteVehicle
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
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

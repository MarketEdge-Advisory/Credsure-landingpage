import React, { useState, useRef } from 'react';
import { Plus, Search, Pencil, Trash2, Download, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, UploadCloud, Minus } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { useCarContext } from '../../context/CarContext';

const allVehicles = [
  {
    id: 1,
    name: 'Suzuki Swift',
    description: 'The Suzuki Swift 1.2L is a compact hatchback designed for drivers who value efficiency, reliability, and modern styling.',
    image: '/across_suzuki.avif',
    modelYear: '2026',
    bestPrice: '₦4,000,000',
    variant: 'Swift GL (Base version), Swift GL...',
    specification: 'Engine Performance....',
    status: 'Available',
  },
  {
    id: 2,
    name: 'New Dzire',
    description: 'The Suzuki Swift 1.2L is a compact hatchback designed for drivers who value efficiency, reliability, and modern styling.',
    image: '/Grand-vitara5.1L.avif',
    modelYear: '2026',
    bestPrice: '₦250,000.00',
    variant: 'Swift GL (Base version), Swift GL...',
    specification: 'Engine Performance....',
    status: 'Not-Available',
  },
  {
    id: 3,
    name: 'Grand Vitara',
    description: 'The Suzuki Swift 1.2L is a compact hatchback designed for drivers who value efficiency, reliability, and modern styling.',
    image: '/Grand-vitara5.1L.avif',
    modelYear: '2026',
    bestPrice: '₦250,000.00',
    variant: 'Swift GL (Base version), Swift GL...',
    specification: 'Engine Performance....',
    status: 'Coming Soon',
  },
  {
    id: 4,
    name: 'Fronx',
    description: 'The Suzuki Swift 1.2L is a compact hatchback designed for drivers who value efficiency, reliability, and modern styling.',
    image: '/Eeco-cargo.avif',
    modelYear: '2026',
    bestPrice: '₦250,000.00',
    variant: 'Swift GL (Base version), Swift GL...',
    specification: 'Engine Performance....',
    status: 'Coming Soon',
  },
  {
    id: 5,
    name: 'Ertiga',
    description: 'The Suzuki Ertiga is a versatile MPV combining spacious seating with efficient performance.',
    image: '/across_suzuki.avif',
    modelYear: '2026',
    bestPrice: '₦3,200,000',
    variant: 'Ertiga GL, Ertiga Sport...',
    specification: 'Engine Performance....',
    status: 'Available',
  },
  {
    id: 6,
    name: 'Jimny',
    description: 'The Suzuki Jimny is a legendary off-road compact SUV built for rugged terrain and adventure.',
    image: '/Eeco-cargo.avif',
    modelYear: '2026',
    bestPrice: '₦5,500,000',
    variant: 'Jimny GL, Jimny GLX...',
    specification: 'Engine Performance....',
    status: 'Available',
  },
  {
    id: 7,
    name: 'Baleno',
    description: 'The Suzuki Baleno is a premium hatchback offering a perfect blend of style and practicality.',
    image: '/Grand-vitara5.1L.avif',
    modelYear: '2026',
    bestPrice: '₦2,800,000',
    variant: 'Baleno GL, Baleno Alpha...',
    specification: 'Engine Performance....',
    status: 'Not-Available',
  },
  {
    id: 8,
    name: 'Eeco Cargo',
    description: 'The Suzuki Eeco Cargo is a practical light commercial vehicle designed for business use.',
    image: '/Eeco-cargo.avif',
    modelYear: '2026',
    bestPrice: '₦1,800,000',
    variant: 'Eeco Standard, Eeco CNG...',
    specification: 'Engine Performance....',
    status: 'Available',
  },
  {
    id: 9,
    name: 'Ciaz',
    description: 'The Suzuki Ciaz is a sophisticated sedan offering comfort and premium features at an accessible price.',
    image: '/across_suzuki.avif',
    modelYear: '2026',
    bestPrice: '₦3,500,000',
    variant: 'Ciaz GL, Ciaz GLX...',
    specification: 'Engine Performance....',
    status: 'Coming Soon',
  },
  {
    id: 10,
    name: 'S-Cross',
    description: 'The Suzuki S-Cross is a stylish crossover combining urban versatility with off-road capability.',
    image: '/Grand-vitara5.1L.avif',
    modelYear: '2026',
    bestPrice: '₦4,700,000',
    variant: 'S-Cross GL, S-Cross AllGrip...',
    specification: 'Engine Performance....',
    status: 'Available',
  },
];

const PAGE_SIZES = [10, 20, 50];

const statusConfig = {
  Available: { dot: 'bg-green-500', text: 'text-green-500' },
  'Not-Available': { dot: 'bg-red-500', text: 'text-red-500' },
  'Coming Soon': { dot: 'bg-yellow-500', text: 'text-yellow-500' },
};

const AddVehicleForm = ({ onBack }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    carName: '',
    description: '',
    modelYear: '',
    vehiclePrice: '',
    variant: '',
    carListing: '',
    engineSpec: '',
    transmissionSpec: '',
    fuelTypeSpec: '',
  });

  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="p-8 w-full">
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Save Details
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Upload Image Row */}
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Upload Vehicle Image</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Click to upload</p>
              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
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
                className="hidden"
                onChange={(e) => handleImageFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Car Details Row */}
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Input Car Details</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                <input
                  type="text"
                  placeholder="Enter car name"
                  value={form.carName}
                  onChange={handleChange('carName')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.description}
                  onChange={handleChange('description')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Year</label>
                <input
                  type="text"
                  placeholder="Enter model year"
                  value={form.modelYear}
                  onChange={handleChange('modelYear')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={form.vehiclePrice}
                  onChange={handleChange('vehiclePrice')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                <input
                  type="text"
                  placeholder="Enter car variant"
                  value={form.variant}
                  onChange={handleChange('variant')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Listing</label>
                <input
                  type="text"
                  placeholder="Enter car listing details"
                  value={form.carListing}
                  onChange={handleChange('carListing')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Car Specifications Row */}
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Input Car Specifications</p>
            </div>
            <div className="flex flex-col gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type Specification</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.fuelTypeSpec}
                  onChange={handleChange('fuelTypeSpec')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditVehicleForm = ({ vehicle, onBack }) => {
  const fileInputRef = useRef(null);
  const changeInputRefs = useRef([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(
    [vehicle.image, vehicle.image, vehicle.image]
  );
  const [form, setForm] = useState({
    carName: vehicle.name || '',
    description: vehicle.description || '',
    modelYear: vehicle.modelYear || '',
    vehiclePrice: vehicle.bestPrice || '',
    variant: vehicle.variant || '',
    carListing: vehicle.status || '',
    engineSpec: '',
    transmissionSpec: '',
    fuelTypeSpec: '',
  });

  const handleNewImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setUploadedImages((prev) => [...prev, e.target.result]);
    reader.readAsDataURL(file);
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
    handleNewImageFile(e.dataTransfer.files[0]);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

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
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Save Details
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Upload Image Row */}
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Upload Vehicle Image</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Click to upload more images</p>
              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
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
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Input Car Details</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                <input
                  type="text"
                  placeholder="Enter car name"
                  value={form.carName}
                  onChange={handleChange('carName')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.description}
                  onChange={handleChange('description')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Year</label>
                <input
                  type="text"
                  placeholder="Enter model year"
                  value={form.modelYear}
                  onChange={handleChange('modelYear')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={form.vehiclePrice}
                  onChange={handleChange('vehiclePrice')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                <input
                  type="text"
                  placeholder="Enter car variant"
                  value={form.variant}
                  onChange={handleChange('variant')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Listing</label>
                <input
                  type="text"
                  placeholder="Enter car listing details"
                  value={form.carListing}
                  onChange={handleChange('carListing')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Car Specifications Row */}
          <div className="grid grid-cols-[200px_1fr] gap-8 py-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Input Car Specifications</p>
            </div>
            <div className="flex flex-col gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type Specification</label>
                <textarea
                  placeholder="Enter Message..."
                  rows={4}
                  value={form.fuelTypeSpec}
                  onChange={handleChange('fuelTypeSpec')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CarManagement = () => {
  const { inventory, addStock, removeStock, setStock } = useCarContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [search, setSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  if (showAddForm) {
    return <AddVehicleForm onBack={() => setShowAddForm(false)} />;
  }

  if (editingVehicle) {
    return <EditVehicleForm vehicle={editingVehicle} onBack={() => setEditingVehicle(null)} />;
  }

  const filtered = allVehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
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
    <div className="p-8 w-full">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Effortlessly control vehicle details, pricing, listings, and media in one centralized dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add New Vehicle
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="font-semibold text-gray-900">Recent Cheque Items</p>
            <p className="text-sm text-gray-400 mt-0.5">Latest processed cheques across all batches</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search car names..."
                value={search}
                onChange={handleSearch}
                className="border border-gray-200 rounded-sm pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 w-56"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={15} />
              Download
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker((o) => !o)}
                className="flex items-center gap-2 border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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

        {/* Vehicle Cards */}
        <div className="flex flex-col gap-4">
          {pageItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No vehicles found.</div>
          ) : (
            pageItems.map((vehicle) => {
              const status = statusConfig[vehicle.status] || statusConfig['Available'];
              return (
                <div key={vehicle.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Card Top */}
                  <div className="flex gap-5 p-5">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-44 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-sm font-medium ${status.text}`}>{vehicle.status}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-lg">
                        {vehicle.description}
                      </p>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Model Year:</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{vehicle.modelYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Best Price:</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{vehicle.bestPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Variant:</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{vehicle.variant}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Specification</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{vehicle.specification}</p>
                        </div>
                      </div>

                      {/* Inventory Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <p className="text-sm text-gray-400 font-medium">Inventory:</p>
                        <div className="flex items-center gap-2">
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
                            className="w-16 text-center border border-gray-200 rounded-md py-1 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-400"
                          />
                          <button
                            onClick={() => addStock(vehicle.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-green-50 hover:border-green-300 text-gray-500 hover:text-green-600 transition-colors"
                            title="Add 1 unit"
                          >
                            <Plus size={13} />
                          </button>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
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
                  <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setEditingVehicle(vehicle)}
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit Vehicle Details
                    </button>
                    <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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

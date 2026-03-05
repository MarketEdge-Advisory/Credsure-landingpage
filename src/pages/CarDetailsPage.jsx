import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  Info
} from 'lucide-react';
import { getCar } from '../api/cars';
import Header from '../components/Header';

// Helper to optimize Cloudinary URLs
const optimizeImageUrl = (url, width = 900) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await getCar(id);
        // Handle both direct object and wrapped response
        if (response && response.status && response.data) {
          setCar(response.data);
        } else if (response && response._id) {
          // If API returns the car object directly
          setCar(response);
        } else {
          console.error('Unexpected API response:', response);
          setCar(null);
        }
      } catch (err) {
        console.error('Failed to load car details:', err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return '₦0';
    return `₦${Number(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Car not found.</p>
      </div>
    );
  }

  const description = car.description || 'No description available.';
  const variants = car.variant
    ? Array.isArray(car.variant)
      ? car.variant
      : car.variant.split(',').map(v => v.trim())
    : [];

  // Ensure images is an array of URLs
  const images = car.images && car.images.length > 0
    ? car.images.map(img => img.url || img)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        {/* <Header /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to vehicles
        </button>
<h1 className="text-gl md:text-xl font-bold text-blue-500 mb-4">{`${car.name} ${car.variant}`}</h1>
        {/* Main card with carousel and details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col w-full">
            {/* Left side: Carousel */}
            <div className="w-full bg-gray-100 relative flex items-center justify-center" style={{ minHeight: '300px' }}>
              {images.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={optimizeImageUrl(images[imgIdx], 900)}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow cursor-pointer"
                        onClick={() => setImgIdx(i => (i === 0 ? images.length - 1 : i - 1))}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow cursor-pointer"
                        onClick={() => setImgIdx(i => (i === images.length - 1 ? 0 : i + 1))}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {/* Image counter */}
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs rounded-full px-3 py-1">
                    {imgIdx + 1} / {images.length}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 p-8">
                  <span>No images available</span>
                </div>
              )}
            </div>

            {/* Right side: Details */}
            <div className="flex w-full flex-col p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start w-full justify-between gap-4">
                    <p className="w-2/3 text-sm text-gray-500">Description</p>
                    <p className="text-gray-800">{description}</p>
                </div>
                  <div className="flex items-start w-full justify-between">
                      <p className="text-sm text-gray-500">Vehicle Price</p>
                      <p className="text-gray-800 font-medium">{formatPrice(car.basePrice || car.price)}</p>
                  </div>
                <div className="flex items-start w-full justify-between">
                    <p className="text-sm text-gray-500">Variants</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {variants.length > 0 ? (
                        variants.map((v, idx) => (
                          <span key={idx} className="text-gray-500 text-xs font-medium px-2.5 py-1 rounded">
                            {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600">No variants listed</span>
                      )}
                  </div>
                </div>

                <div className="flex items-center w-full justify-between">
                    <p className="text-sm text-gray-500">Car Listing</p>
                    <p className="text-green-700 font-medium first-letter:uppercase lowercase">{car.availability || 'Available'}</p>
                </div>
              </div>
            </div>
            {/* Technical Specifications */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 px-8">Car Details</h2>
        <div className="flex w-full flex-col pb-10">
          <div className="w-full flex items-center justify-between px-8">
            <h3 className="text-sm font-normal text-gray-500 mb-3 flex items-center">
              {/* <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span> */}
              Engine Capacity
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {car.specs?.engine || description}
            </p>
          </div>
          <div className="w-full flex items-center justify-between px-8">
            <h3 className="text-sm font-normal text-gray-500 mb-3 flex items-center">
              {/* <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span> */}
              Transmission Specifications
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {car.specs?.transmission || description}
            </p>
          </div>
        </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CarDetailsPage;
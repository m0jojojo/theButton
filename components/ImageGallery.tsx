'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group cursor-zoom-in">
        {images[selectedImage] ? (
          images[selectedImage].startsWith('data:') ? (
            // Base64 data URL - use regular img tag
            <img
              src={images[selectedImage]}
              alt={`${productName} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
          ) : images[selectedImage].startsWith('http') ? (
            // HTTP/HTTPS URL - use Next.js Image
            <Image
              src={images[selectedImage]}
              alt={`${productName} - Image ${selectedImage + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={selectedImage === 0}
              onClick={handleImageClick}
              quality={90}
            />
          ) : (
            // Placeholder for invalid images
            <div
              className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              <span className="text-gray-500 text-sm">Product Image {selectedImage + 1}</span>
            </div>
          )
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            <span className="text-gray-500 text-sm">Product Image {selectedImage + 1}</span>
          </div>
        )}
        
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Click to zoom
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 transition-all ${
                selectedImage === index
                  ? 'border-gray-900 scale-105'
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-pressed={selectedImage === index}
            >
              {image ? (
                image.startsWith('data:') ? (
                  // Base64 data URL - use regular img tag
                  <img
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : image.startsWith('http') ? (
                  // HTTP/HTTPS URL - use Next.js Image
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                    quality={75}
                  />
                ) : (
                  // Placeholder for invalid images
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">{index + 1}</span>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{index + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              {images[selectedImage] ? (
                images[selectedImage].startsWith('data:') ? (
                  // Base64 data URL - use regular img tag
                  <img
                    src={images[selectedImage]}
                    alt={`${productName} - Zoomed view`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : images[selectedImage].startsWith('http') ? (
                  // HTTP/HTTPS URL - use Next.js Image
                  <Image
                    src={images[selectedImage]}
                    alt={`${productName} - Zoomed view`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="90vw"
                    quality={100}
                    priority
                  />
                ) : (
                  // Placeholder for invalid images
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">Zoomed Image {selectedImage + 1}</span>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">Zoomed Image {selectedImage + 1}</span>
                </div>
              )}
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                aria-label="Close zoom"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


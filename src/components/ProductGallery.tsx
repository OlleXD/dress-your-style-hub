import { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (images.length === 0) return null;

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 50);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 50);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === selectedImage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsTransitioning(false);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border group">
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${productName} - Bild ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 ${
                index === selectedImage
                  ? 'opacity-100 translate-x-0'
                  : index < selectedImage
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatyr ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <div className="relative w-full h-full">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={productName}
                  className={`absolute inset-0 max-w-full max-h-[90vh] object-contain transition-all duration-300 ease-in-out ${
                    index === selectedImage
                      ? 'opacity-100 translate-x-0'
                      : index < selectedImage
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                />
              ))}
            </div>
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;


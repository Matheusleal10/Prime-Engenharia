import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Start loading 50px before entering viewport
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const baseStyles = `transition-opacity duration-300 ${
    isLoaded ? 'opacity-100' : 'opacity-0'
  }`;

  const styles = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    objectFit
  };

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"
          style={styles}
        />
      )}
      
      {/* Actual image */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`${baseStyles} ${className}`}
          style={styles}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
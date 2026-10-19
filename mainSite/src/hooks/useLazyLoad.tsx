import { useEffect, useRef, useState } from 'react';

export const useLazyLoad = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Once loaded, stop observing
          if (targetRef.current) {
            observer.unobserve(targetRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '50px', // Start loading 50px before element is visible
        threshold: 0.01,
        ...options,
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  return [targetRef, isIntersecting] as const;
};

// Lazy loading image component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className = '', placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E' }) => {
  const [ref, isIntersecting] = useLazyLoad();
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <img
        src={isIntersecting ? src : placeholder}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};



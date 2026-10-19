// Performance configuration based on device capabilities

export const getDeviceCapabilities = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true;
  const hasLowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false;

  return {
    isMobile,
    isLowEnd,
    hasLowMemory,
    shouldReduceMotion: isLowEnd || hasLowMemory || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    shouldDisableBlur: isLowEnd || hasLowMemory,
    shouldLazyLoad: true,
    imageQuality: hasLowMemory ? 'low' : 'high',
  };
};

export const performanceConfig = getDeviceCapabilities();

// Debounce function for scroll/resize events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image optimization helper
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  if (!url || url.startsWith('data:')) return url;
  
  const { imageQuality } = performanceConfig;
  
  // If using a CDN, you could add query params here
  // For now, just return the original URL
  return url;
};

// Lazy loading configuration
export const lazyLoadConfig = {
  rootMargin: performanceConfig.isMobile ? '100px' : '200px',
  threshold: 0.01,
};



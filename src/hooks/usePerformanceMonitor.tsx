import { useEffect } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let loadTime = 0;
    const startTime = performance.now();

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`📊 Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
      }
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    const handleLoad = () => {
      loadTime = performance.now() - startTime;
      console.log(`🚀 Site carregado em: ${loadTime.toFixed(2)}ms`);
      
      // Log Core Web Vitals
      if ('web-vitals' in window) {
        console.log('📈 Core Web Vitals disponíveis');
      }
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
    };
  }, []);
};
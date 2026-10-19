import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface VirtualizedGridProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemHeight?: number;
  gap?: number;
  className?: string;
}

export const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
  items,
  renderItem,
  itemHeight = 400,
  gap = 24,
  className = '',
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // On mobile, render all items (lists are usually short)
    // On desktop, use virtualization
    if (isMobile) {
      setVisibleRange({ start: 0, end: items.length });
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const viewportHeight = window.innerHeight;

      const startIndex = Math.max(
        0,
        Math.floor((scrollTop - containerTop) / (itemHeight + gap)) - 2
      );
      const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop - containerTop + viewportHeight) / (itemHeight + gap)) + 2
      );

      setVisibleRange({ start: startIndex, end: endIndex });
    };

    // Initial calculation
    handleScroll();

    // Throttled scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [items.length, itemHeight, gap, isMobile]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const offsetY = visibleRange.start * (itemHeight + gap);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Spacer to maintain scroll height */}
      <div style={{ height: items.length * (itemHeight + gap) }} />
      
      {/* Visible items */}
      <div
        className="absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        {visibleItems.map((item, index) => (
          <React.Fragment key={visibleRange.start + index}>
            {renderItem(item, visibleRange.start + index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


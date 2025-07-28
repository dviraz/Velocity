'use client';

import { useEffect, useRef, useState } from 'react';

const ComparisonSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterImageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const setSliderPosition = (x: number) => {
    if (!containerRef.current || !afterImageRef.current || !handleRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = ((x - rect.left) / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    afterImageRef.current.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    handleRef.current.style.left = `${percentage}%`;
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  const onPointerMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setSliderPosition(e.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setSliderPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('touchend', onPointerUp);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [isDragging]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            See the Difference for Yourself
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Drag the slider to see the dramatic impact of our optimizations. From frustratingly slow to instantly responsive.
          </p>
        </div>
        
        <div 
          ref={containerRef}
          className="comparison-slider max-w-4xl mx-auto"
        >
          <div ref={afterImageRef} className="after-image">
            <img 
              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop" 
              alt="Fast Website" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/1280x720/10B981/FFFFFF?text=Optimized+Site';
              }}
            />
            <div className="absolute top-4 left-4 bg-emerald-500/80 text-white text-sm font-bold py-1 px-3 rounded-full">
              AFTER
            </div>
          </div>
          
          <div className="before-image">
            <img 
              src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070&auto=format&fit=crop" 
              alt="Slow Website" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/1280x720/F87171/FFFFFF?text=Slow+Site';
              }}
            />
            <div className="absolute top-4 right-4 bg-red-500/80 text-white text-sm font-bold py-1 px-3 rounded-full">
              BEFORE
            </div>
          </div>
          
          <div 
            ref={handleRef}
            className="slider-handle" 
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          />
        </div>
      </div>
    </section>
  );
};

export default ComparisonSlider;

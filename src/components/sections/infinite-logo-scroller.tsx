'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const logos = [
    { src: "/logos/4j1sdxd4jf1sxd4j1s.png", alt: "Logo 1" },
    { src: "/logos/4j1sxd4j1sjxd4j1s.png", alt: "Logo 2" },
    { src: "/logos/4j1sxd4j1sxbd4j1s.png", alt: "Logo 3" },
    { src: "/logos/7o89a87o89a87o89.png", alt: "Logo 4" },
    { src: "/logos/7o89aa7o89aa7o89.png", alt: "Logo 5" },
    { src: "/logos/99r3ln99r3ln99r3.png", alt: "Logo 6" },
    { src: "/logos/99r3lo99r3lo99r3.png", alt: "Logo 7" },
    { src: "/logos/xn6lbuxn6lbuxn6l.png", alt: "Logo 8" },
    { src: "/logos/Gemini_Generated_Image_6432l6432l6432l6.png", alt: "Logo 9" },
    { src: "/logos/Gemini_Generated_Image_bflls1bflls1bfll.png", alt: "Logo 10" },
    { src: "/logos/Gemini_Generated_Image_k8byjlk8byjlk8by.png", alt: "Logo 11" },
];

interface InfiniteLogoScrollerProps {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  logoHeight?: string;
  gap?: string;
  maskGradient?: boolean;
  grayscale?: boolean;
}

const InfiniteLogoScroller: React.FC<InfiniteLogoScrollerProps> = ({
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  logoHeight = 'h-24',
  gap = 'gap-x-12',
  maskGradient = true,
  grayscale = false,
}) => {
  const scrollerClasses = cn(
    'scroller',
    { 'scroller--masked': maskGradient },
    { 'hover:pause-animation': pauseOnHover }
  );

  const scrollerInnerClasses = cn(
    'scroller__inner',
    gap
  );

  const animationDuration = `${speed}s`;
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Set animated to true after the component mounts
    // This ensures the animation starts correctly
    setIsAnimated(true);
  }, []);

  return (
    <div className={scrollerClasses} data-animated={isAnimated}>
      <ul
        className={scrollerInnerClasses}
        style={{ animationDuration, animationDirection: direction === 'right' ? 'reverse' : 'normal' }}
      >
        {logos.map((logo, index) => (
          <li key={index}>
            <img src={logo.src} alt={logo.alt} className={cn('max-h-full', logoHeight, { 'logo-grayscale': grayscale })} />
          </li>
        ))}
        {logos.map((logo, index) => (
          <li key={`duplicate-${index}`} aria-hidden="true">
            <img src={logo.src} alt={logo.alt} className={cn('max-h-full', logoHeight, { 'logo-grayscale': grayscale })} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteLogoScroller;
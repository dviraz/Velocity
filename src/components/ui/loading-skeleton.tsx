'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
  rows?: number;
  animate?: boolean;
}

const LoadingSkeleton = ({ 
  className, 
  variant = 'default',
  rows = 1,
  animate = true
}: LoadingSkeletonProps) => {
  const baseClasses = cn(
    "bg-gray-700/50 rounded",
    {
      "animate-pulse": animate,
    }
  );

  if (variant === 'card') {
    return (
      <div className={cn("space-y-4 p-6 bg-gray-800/50 rounded-lg border border-gray-700", className)}>
        <div className="flex items-center space-x-4">
          <div className={cn(baseClasses, "h-12 w-12 rounded-full")} />
          <div className="space-y-2 flex-1">
            <div className={cn(baseClasses, "h-4 w-3/4")} />
            <div className={cn(baseClasses, "h-3 w-1/2")} />
          </div>
        </div>
        <div className="space-y-3">
          <div className={cn(baseClasses, "h-4 w-full")} />
          <div className={cn(baseClasses, "h-4 w-5/6")} />
          <div className={cn(baseClasses, "h-4 w-4/6")} />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              baseClasses, 
              "h-4",
              index === rows - 1 ? "w-3/4" : "w-full"
            )} 
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn(baseClasses, "rounded-full aspect-square", className)} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, "h-12 w-full rounded-lg", className)} />
    );
  }

  // Default variant
  return (
    <div className={cn(baseClasses, "h-4 w-full", className)} />
  );
};

// Results page specific skeleton
export const ResultsLoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <div className="bg-gray-700/50 animate-pulse h-10 w-3/4 mx-auto rounded" />
        <div className="bg-gray-700/50 animate-pulse h-6 w-1/2 mx-auto rounded" />
      </div>

      {/* Performance score skeleton */}
      <div className="border-2 border-gray-700 rounded-lg p-6 space-y-6">
        <div className="text-center">
          <div className="bg-gray-700/50 animate-pulse h-8 w-48 mx-auto rounded mb-4" />
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center space-y-2">
              <div className="bg-gray-700/50 animate-pulse h-20 w-32 rounded" />
              <div className="bg-gray-700/50 animate-pulse h-8 w-24 rounded" />
            </div>
            <div className="bg-gray-700/50 animate-pulse w-24 h-24 rounded-full" />
          </div>
        </div>
        
        {/* Business impact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-gray-700/50 animate-pulse w-5 h-5 rounded" />
                <div className="bg-gray-700/50 animate-pulse h-4 w-24 rounded" />
              </div>
              <div className="bg-gray-700/50 animate-pulse h-6 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Issues skeleton */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-700/50 animate-pulse w-6 h-6 rounded" />
          <div className="bg-gray-700/50 animate-pulse h-8 w-64 rounded" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} variant="card" />
          ))}
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="bg-gradient-to-r from-emerald-50/10 to-blue-50/10 border border-emerald-700/50 rounded-lg p-8 text-center space-y-4">
        <div className="bg-gray-700/50 animate-pulse h-8 w-64 mx-auto rounded" />
        <div className="bg-gray-700/50 animate-pulse h-6 w-96 mx-auto rounded" />
        <div className="flex justify-center items-center space-x-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="bg-emerald-500/50 w-2 h-2 rounded-full" />
              <div className="bg-gray-700/50 animate-pulse h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Form skeleton
export const FormLoadingSkeleton = () => {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="bg-gray-700/50 animate-pulse h-8 w-48 mx-auto rounded" />
        <div className="bg-gray-700/50 animate-pulse h-5 w-64 mx-auto rounded" />
      </div>
      
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="bg-gray-700/50 animate-pulse h-4 w-24 rounded" />
          <div className="bg-gray-700/50 animate-pulse h-12 w-full rounded-lg" />
        </div>
      ))}
      
      <LoadingSkeleton variant="button" className="mt-6" />
    </div>
  );
};

export default LoadingSkeleton;
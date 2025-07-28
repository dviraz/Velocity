'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  steps, 
  className 
}: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Mobile view - compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-emerald-300 font-medium">
            {steps[currentStep - 1]}
          </p>
        </div>
      </div>

      {/* Desktop view - detailed */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <div className="relative">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      {
                        "bg-emerald-600 text-white shadow-lg scale-110": isActive,
                        "bg-emerald-500 text-white": isCompleted,
                        "bg-gray-600 text-gray-400": isUpcoming,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isActive ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Active step pulse effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-emerald-600 animate-ping opacity-20" />
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center max-w-20">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      {
                        "text-emerald-300": isActive || isCompleted,
                        "text-gray-500": isUpcoming,
                      }
                    )}
                  >
                    {step}
                  </p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-full w-full h-0.5 -translate-y-1/2 -z-10">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        {
                          "bg-emerald-500": stepNumber < currentStep,
                          "bg-gray-600": stepNumber >= currentStep,
                        }
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
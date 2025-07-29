'use client';

import { Suspense } from 'react';
import ResultsDisplay from '@/components/sections/results-display';
import ErrorBoundary, { SessionExpiredFallback } from '@/components/ui/error-boundary';
import { ResultsLoadingSkeleton } from '@/components/ui/loading-skeleton';

interface ResultsContentProps {
  analysisData: {
    url: string;
    email: string;
    performanceScore: number;
    issues: Array<{
      id: string;
      title: string;
      description: string;
      severity: 'Low' | 'Medium' | 'High';
    }>;
  };
}

export default function ResultsContent({ analysisData }: ResultsContentProps) {
  return (
    <ErrorBoundary
      fallback={SessionExpiredFallback}
      onError={(error, errorInfo) => {
        console.error('Results page error:', error, errorInfo);
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Results Display - Full width, single column layout */}
        <Suspense fallback={<ResultsLoadingSkeleton />}>
          <ResultsDisplay
            analysisData={analysisData}
            onRetry={() => {
              window.location.reload();
            }}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
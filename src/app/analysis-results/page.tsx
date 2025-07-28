import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ResultsDisplay from '@/components/sections/results-display';
import FinalLeadForm from '@/components/sections/final-lead-form';
import { validateSession } from '@/lib/session';
import ErrorBoundary, { SessionExpiredFallback } from '@/components/ui/error-boundary';
import { ResultsLoadingSkeleton, FormLoadingSkeleton } from '@/components/ui/loading-skeleton';

// Results content component with error boundary
function ResultsContent({ analysisData }: { analysisData: any }) {
  return (
    <ErrorBoundary
      fallback={SessionExpiredFallback}
      onError={(error, errorInfo) => {
        console.error('Results page error:', error, errorInfo);
      }}
    >
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Results Display - Takes up 2/3 of the width */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ResultsLoadingSkeleton />}>
            <ResultsDisplay
              analysisData={analysisData}
              onRetry={() => {
                window.location.reload();
              }}
            />
          </Suspense>
        </div>
        
        {/* Lead Form - Takes up 1/3 of the width, sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <Suspense fallback={<FormLoadingSkeleton />}>
              <FinalLeadForm
                prefilledData={{
                  email: analysisData.email,
                  website: analysisData.url,
                }}
                onSubmit={(data) => {
                  console.log('Lead form submitted:', data);
                  // CRM integration will be handled in the form component
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default async function AnalysisResultsPage() {
  // Get session data - redirect if no valid session
  const session = await validateSession();
  
  if (!session || !session.analysis || !session.email) {
    redirect('/');
  }

  const analysisData = {
    url: session.url,
    email: session.email,
    performanceScore: session.analysis.performanceScore,
    issues: session.analysis.issues,
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6">
            <ResultsContent analysisData={analysisData} />
          </div>
        </section>

        {/* Additional value proposition section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              Why Choose VelocityLab for Your Optimization?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: '⚡',
                  title: 'Proven Results',
                  description: "We've helped over 500+ companies achieve 40-80% faster load times and measurable conversion improvements."
                },
                {
                  icon: '🎯',
                  title: 'Business-Focused',
                  description: "We don't just fix technical issues - we optimize for your specific business goals and conversion metrics."
                },
                {
                  icon: '🚀',
                  title: 'Fast Implementation',
                  description: 'Most optimizations are completed within 2-4 weeks, with immediate performance improvements you can measure.'
                }
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              Trusted by Fast-Growing Companies
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 mb-8">
              {/* Placeholder for company logos */}
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company, index) => (
                <div
                  key={company}
                  className="bg-gray-200 px-8 py-4 rounded hover:bg-gray-300 transition-colors duration-300 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {company}
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { value: '2.3s', label: 'Average load time reduction' },
                { value: '18%', label: 'Average conversion increase' },
                { value: '500+', label: 'Websites optimized' }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${600 + index * 150}ms` }}
                >
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Website Performance Analysis Results | VelocityLab',
  description: 'Your detailed website performance analysis results with business-focused optimization recommendations.',
  robots: 'noindex, nofollow', // Don't index results pages
};
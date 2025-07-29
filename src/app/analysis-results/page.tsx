import { redirect } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { validateSession } from '@/lib/session';
import ResultsContent from '@/components/sections/results-content';
import FinalLeadForm from '@/components/sections/final-lead-form';

export default async function AnalysisResultsPage() {
  // Get session data - redirect if no valid session
  // Updated: July 29, 2025 - Testing git sync with GitHub repository
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

        {/* Enhanced value proposition section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                Why Choose Get Speed for Your Optimization?
              </h2>
              <p className="text-xl text-gray-600 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
                Join hundreds of companies that have already transformed their website performance and business results
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: '⚡',
                  title: 'Proven Results',
                  description: "We've helped over 500+ companies achieve 40-80% faster load times and measurable conversion improvements.",
                  highlight: '40-80% faster',
                  color: 'emerald'
                },
                {
                  icon: '🎯',
                  title: 'Business-Focused',
                  description: "We don't just fix technical issues - we optimize for your specific business goals and conversion metrics.",
                  highlight: 'Business goals',
                  color: 'blue'
                },
                {
                  icon: '🚀',
                  title: 'Fast Implementation',
                  description: 'Most optimizations are completed within 2-4 weeks, with immediate performance improvements you can measure.',
                  highlight: '2-4 weeks',
                  color: 'purple'
                }
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-200 to-${item.color}-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className={`inline-block px-4 py-2 bg-${item.color}-100 text-${item.color}-800 rounded-full text-sm font-semibold`}>
                      {item.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced social proof section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              Trusted by Fast-Growing Companies
            </h2>
            <p className="text-lg text-gray-600 mb-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
              From startups to enterprise, we've helped companies of all sizes boost their performance
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              {[
                { name: 'TechFlow Solutions', industry: 'SaaS' },
                { name: 'EcoMart', industry: 'E-commerce' },
                { name: 'FinanceForward', industry: 'FinTech' },
                { name: 'HealthHub Pro', industry: 'Healthcare' },
                { name: 'EduTech Labs', industry: 'Education' }
              ].map((company, index) => (
                <div
                  key={company.name}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                    {company.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{company.industry}</div>
                </div>
              ))}
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { value: '2.3s', label: 'Average load time reduction', icon: '⚡', description: 'Faster page loads' },
                { value: '18%', label: 'Average conversion increase', icon: '📈', description: 'Better business results' },
                { value: '500+', label: 'Websites optimized', icon: '🌐', description: 'Proven experience' }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${600 + index * 150}ms` }}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black text-emerald-600 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Form Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                Ready to Boost Your Website Performance?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
                Get your personalized optimization plan and start seeing results in 2-4 weeks
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
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
              </div>
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
  title: 'Website Performance Analysis Results | Get Speed',
  description: 'Your detailed website performance analysis results with business-focused optimization recommendations.',
  robots: 'noindex, nofollow', // Don't index results pages
};
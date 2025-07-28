'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  translateAndPrioritizeIssues,
  getPerformanceScoreMessage,
  getBusinessImpactEstimate,
  type TranslatedIssue
} from '@/lib/issue-translator';
import { AlertTriangle, TrendingDown, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ResultsLoadingSkeleton } from '@/components/ui/loading-skeleton';
import ErrorBoundary, { SessionExpiredFallback } from '@/components/ui/error-boundary';
import { Button } from '@/components/ui/button';

export interface AnalysisData {
  url: string;
  email: string;
  performanceScore: number;
  issues: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }>;
}

interface ResultsDisplayProps {
  analysisData: AnalysisData;
  isLoading?: boolean;
  onRetry?: () => void;
}

const getSeverityColor = (severity: 'Low' | 'Medium' | 'High') => {
  switch (severity) {
    case 'High':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
};

const getProgressColor = (score: number) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

const ResultsDisplay = ({ analysisData, isLoading = false, onRetry }: ResultsDisplayProps) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [displayData, setDisplayData] = useState(analysisData);

  // Validate analysis data
  useEffect(() => {
    if (!analysisData || !analysisData.url || typeof analysisData.performanceScore !== 'number') {
      console.error('Invalid analysis data:', analysisData);
      return;
    }
    
    setDisplayData(analysisData);
    // Trigger animation after mount
    setTimeout(() => setIsAnimated(true), 100);
  }, [analysisData]);

  // Show loading skeleton while loading
  if (isLoading) {
    return <ResultsLoadingSkeleton />;
  }

  // Show error state if no valid data
  if (!displayData || !displayData.url || typeof displayData.performanceScore !== 'number') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200 bg-red-50/10">
          <CardContent className="text-center p-8 space-y-6">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Data Loading Error
              </h3>
              <p className="text-gray-600">
                We couldn't load your analysis results. This might be due to a session timeout or data corruption.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Start New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { url, performanceScore, issues } = displayData;
  const translatedIssues = translateAndPrioritizeIssues(issues);
  const scoreMessage = getPerformanceScoreMessage(performanceScore);
  const businessImpact = getBusinessImpactEstimate(performanceScore);

  // Show top 4 most critical issues
  const topIssues = translatedIssues.slice(0, 4);

  return (
    <ErrorBoundary
      fallback={SessionExpiredFallback}
      onError={(error, errorInfo) => {
        console.error('Results display error:', error, errorInfo);
      }}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className={`text-center transition-all duration-700 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-top-4' : 'opacity-0'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Analysis for{' '}
            <span className="text-emerald-600 break-all">{url}</span>{' '}
            is Complete!
          </h1>
        </div>

        {/* Performance Score Section */}
        <Card className={`border-2 border-gray-200 transition-all duration-700 delay-100 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-700">Overall Performance Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 flex-wrap gap-4">
              <div className="text-center">
                <div className={`text-6xl font-bold transition-all duration-1000 delay-300 ${getScoreColor(performanceScore)} ${isAnimated ? 'scale-100' : 'scale-75 opacity-0'}`}>
                  {performanceScore}
                  <span className="text-2xl text-gray-500">/100</span>
                </div>
                <div className={`text-3xl font-bold mt-2 transition-all duration-700 delay-500 ${scoreMessage.color} ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                  Grade: {scoreMessage.grade}
                </div>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#e5e7eb" strokeWidth="8" fill="none"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke={getProgressColor(performanceScore)}
                    strokeWidth="8" fill="none"
                    strokeDasharray={`${2.51 * performanceScore} 251`}
                    className={`transition-all duration-2000 ease-out delay-400 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      strokeDasharray: isAnimated ? `${2.51 * performanceScore} 251` : '0 251'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold transition-all duration-700 delay-600 ${getScoreColor(performanceScore)} ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                    {performanceScore}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`bg-gray-50 p-4 rounded-lg transition-all duration-700 delay-700 ${isAnimated ? 'animate-in fade-in-50' : 'opacity-0'}`}>
              <p className={`text-lg font-medium ${scoreMessage.color}`}>
                {scoreMessage.message}
              </p>
            </div>

            {/* Business Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { data: businessImpact.bounceRateIncrease, label: 'Bounce Rate Impact', icon: TrendingDown, color: 'red', prefix: '+' },
                { data: businessImpact.conversionImpact, label: 'Conversion Impact', icon: TrendingDown, color: 'orange', prefix: '' },
                { data: businessImpact.seoImpact, label: 'SEO Impact', icon: TrendingUp, color: 'blue', prefix: '' }
              ].map((impact, index) => (
                <div
                  key={impact.label}
                  className={`bg-${impact.color}-50 p-4 rounded-lg border border-${impact.color}-200 transition-all duration-700 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <impact.icon className={`h-5 w-5 text-${impact.color}-600`} />
                    <span className={`font-semibold text-${impact.color}-800 text-sm md:text-base`}>{impact.label}</span>
                  </div>
                  <p className={`text-${impact.color}-700 font-bold`}>{impact.prefix}{impact.data}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Opportunities Section */}
        <div className={`transition-all duration-700 delay-200 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Top Optimization Opportunities
            </h2>
          </div>
          
          {topIssues.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {topIssues.map((issue, index) => (
                <Card
                  key={issue.id}
                  className={`border-l-4 border-l-gray-400 hover:shadow-lg transition-all duration-500 hover:scale-[1.02] ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`}
                  style={{ animationDelay: `${1200 + index * 150}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{issue.icon}</span>
                        <div>
                          <CardTitle className="text-lg text-gray-900">
                            {issue.businessTitle}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={getSeverityColor(issue.severity)}
                            >
                              {issue.severity} Priority
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Issue #{index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                      <AlertTriangle className={`h-5 w-5 ${
                        issue.severity === 'High' ? 'text-red-500' :
                        issue.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {issue.businessImpact}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      Technical: {issue.originalTitle}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className={`transition-all duration-700 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`} style={{ animationDelay: '1200ms' }}>
              <CardContent className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Great Job!
                </h3>
                <p className="text-gray-600">
                  Your website doesn't have any major performance issues that we could detect.
                  Keep up the excellent work!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action Section */}
        <Card className={`bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200 transition-all duration-700 delay-300 ${isAnimated ? 'animate-in fade-in-50 slide-in-from-bottom-4' : 'opacity-0'}`}>
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Fix These Issues?
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Our optimization experts can implement these fixes and boost your website's performance.
              Fill out the form below to get your personalized optimization plan and quote.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Free consultation included</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>24-hour response time</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>No obligation quote</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ResultsDisplay;
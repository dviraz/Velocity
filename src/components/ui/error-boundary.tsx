'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          showDetails={this.props.showErrorDetails}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  onGoHome,
  showDetails = false,
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-red-200 bg-red-50/10">
        <CardContent className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="text-gray-600">
              We encountered an unexpected error. Please try again or return to the home page.
            </p>
          </div>

          {showDetails && error && (
            <details className="text-left bg-gray-100 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Error Details
              </summary>
              <div className="space-y-2 text-gray-600">
                <p><strong>Error:</strong> {error.message}</p>
                {errorInfo && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1 overflow-auto max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onRetry}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={onGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Session expired error fallback
export const SessionExpiredFallback: React.FC<ErrorFallbackProps> = ({
  onGoHome,
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-yellow-200 bg-yellow-50/10">
        <CardContent className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Session Expired
            </h3>
            <p className="text-gray-600">
              Your session has expired. Let's start fresh with a new analysis!
            </p>
          </div>

          <Button 
            onClick={onGoHome}
            className="w-full bg-emerald-600 hover:bg-emerald-500"
          >
            <Home className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Network error fallback
export const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({
  onRetry,
  onGoHome,
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-orange-200 bg-orange-50/10">
        <CardContent className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Connection Issue
            </h3>
            <p className="text-gray-600">
              We couldn't connect to our servers. Please check your internet connection and try again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onRetry}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={onGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Analysis error fallback
export const AnalysisErrorFallback: React.FC<ErrorFallbackProps & { onStartOver?: () => void }> = ({
  onStartOver,
  onGoHome,
}) => {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-red-200 bg-red-50/10">
        <CardContent className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Analysis Failed
            </h3>
            <p className="text-gray-600">
              We couldn't analyze that website. Please try again with a different URL or contact support if the issue persists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onStartOver}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Different URL
            </Button>
            <Button 
              onClick={onGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main ErrorBoundary component (functional wrapper)
const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;
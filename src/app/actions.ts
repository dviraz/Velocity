'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { initializeSession, completeEmailStep, clearSession } from '@/lib/session';

const schema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

const urlOnlySchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type PageSpeedResult = {
  performanceScore: number;
  summary: string;
  issues: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }>;
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    timeToInteractive: number;
  };
};

export type FormState = {
  message: string;
  analysis?: PageSpeedResult;
  isError: boolean;
};

export type UrlAnalysisState = {
  message: string;
  analysis?: PageSpeedResult;
  isError: boolean;
  url?: string;
};

async function analyzeWithPageSpeed(url: string): Promise<PageSpeedResult> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not configured');
  }

  // Call Google PageSpeed Insights API
  const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance&strategy=mobile`;
  
  try {
    console.log('Calling PageSpeed API for URL:', url);
    const response = await fetch(pageSpeedUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PageSpeed API error:', response.status, errorText);
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('PageSpeed API response received');
    
    // Check if the response has the expected structure
    if (!data.lighthouseResult || !data.lighthouseResult.categories || !data.lighthouseResult.categories.performance) {
      console.error('Invalid PageSpeed API response structure:', data);
      throw new Error('Invalid response from PageSpeed API');
    }
    
    const lighthouseResult = data.lighthouseResult;
    const audits = lighthouseResult.audits;
    
    // Extract performance score
    const performanceScore = Math.round(lighthouseResult.categories.performance.score * 100);
    
    // Extract key metrics
    const metrics = {
      firstContentfulPaint: Math.round(audits['first-contentful-paint']?.numericValue || 0),
      largestContentfulPaint: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
      cumulativeLayoutShift: Math.round((audits['cumulative-layout-shift']?.numericValue || 0) * 100) / 100,
      firstInputDelay: Math.round(audits['max-potential-fid']?.numericValue || 0),
      timeToInteractive: Math.round(audits['interactive']?.numericValue || 0),
    };

    // Generate issues from failed audits
    const issues: PageSpeedResult['issues'] = [];
    const auditKeys = [
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficiently-encode-images',
      'legacy-javascript',
      'largest-contentful-paint-element',
      'cumulative-layout-shift',
      'non-composited-animations'
    ];

    auditKeys.forEach(key => {
      const audit = audits[key];
      if (audit && audit.score !== null && audit.score < 0.9) {
        let severity: 'Low' | 'Medium' | 'High' = 'Low';
        if (audit.score < 0.5) severity = 'High';
        else if (audit.score < 0.7) severity = 'Medium';

        issues.push({
          id: key,
          title: audit.title,
          description: audit.description,
          severity,
        });
      }
    });

    // Generate summary based on performance score
    let summary = '';
    if (performanceScore >= 90) {
      summary = 'Excellent! Your website has outstanding performance. Keep up the great work with these optimization practices.';
    } else if (performanceScore >= 70) {
      summary = 'Good performance, but there\'s room for improvement. Focus on the identified issues to boost your site speed further.';
    } else if (performanceScore >= 50) {
      summary = 'Average performance detected. Your website needs optimization to improve user experience and search rankings.';
    } else {
      summary = 'Poor performance detected. Immediate attention required to fix critical speed issues affecting user experience.';
    }

    return {
      performanceScore,
      summary,
      issues: issues.slice(0, 4), // Limit to top 4 issues
      metrics,
    };
  } catch (error) {
    console.error('PageSpeed API error:', error);
    throw new Error('Failed to analyze website performance. Please try again later.');
  }
}

export async function handleAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    url: formData.get('url'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: errors.url?.[0] || errors.email?.[0] || 'Invalid input.',
      isError: true,
    };
  }

  try {
    const result = await analyzeWithPageSpeed(validatedFields.data.url);
    
    // Here you could also store the email for future communications
    // For now, we'll just include it in the success message
    const { email } = validatedFields.data;
    
    return {
      message: `Analysis complete! Results have been prepared for ${email}.`,
      analysis: result,
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred during analysis. Please check your URL and try again.',
      isError: true,
    };
  }
}

export async function handleUrlAnalysis(
  prevState: UrlAnalysisState,
  formData: FormData
): Promise<UrlAnalysisState> {
  console.log('🔍 [DEBUG] URL Analysis started:', {
    timestamp: new Date().toISOString(),
    formDataUrl: formData.get('url'),
    prevState
  });

  const validatedFields = urlOnlySchema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log('❌ [DEBUG] URL Validation failed:', errors);
    return {
      message: errors.url?.[0] || 'Invalid URL.',
      isError: true,
    };
  }

  try {
    console.log('🌐 [DEBUG] Starting PageSpeed analysis for:', validatedFields.data.url);
    const result = await analyzeWithPageSpeed(validatedFields.data.url);
    console.log('✅ [DEBUG] PageSpeed analysis completed:', {
      url: validatedFields.data.url,
      performanceScore: result.performanceScore,
      issuesCount: result.issues.length
    });
    
    // Store analysis result in session
    console.log('💾 [DEBUG] Initializing session...');
    await initializeSession(validatedFields.data.url, result);
    console.log('✅ [DEBUG] Session initialized successfully');
    
    return {
      message: 'Analysis complete!',
      analysis: result,
      url: validatedFields.data.url,
      isError: false,
    };
  } catch (error) {
    console.error('💥 [DEBUG] URL Analysis failed:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      url: validatedFields.data.url,
      timestamp: new Date().toISOString()
    });
    return {
      message: 'An error occurred during analysis. Please check your URL and try again.',
      isError: true,
    };
  }
}

export async function handleEmailSubmission(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('📧 [DEBUG] Email submission started:', {
    timestamp: new Date().toISOString(),
    formDataEmail: formData.get('email'),
    prevState
  });

  const email = formData.get('email') as string;
  
  if (!email || !z.string().email().safeParse(email).success) {
    console.log('❌ [DEBUG] Email validation failed:', { email });
    return {
      message: 'Please enter a valid email address.',
      isError: true,
    };
  }

  try {
    console.log('💾 [DEBUG] Attempting to complete email step for:', email);
    
    // Complete email step and store in session
    await completeEmailStep(email);
    
    console.log('✅ [DEBUG] Email step completed successfully, redirecting to results...');
    
    // Redirect to results page
    redirect('/analysis-results');
  } catch (error) {
    console.error('💥 [DEBUG] Email submission failed:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      email,
      timestamp: new Date().toISOString()
    });
    
    // User-friendly error message instead of technical error
    return {
      message: "We couldn't process your request at this time. Please check your internet connection or try again in a few moments.",
      isError: true,
    };
  }
}

export async function resetSession(): Promise<{ success: boolean }> {
  try {
    console.log('🔄 [DEBUG] Resetting session...');
    await clearSession();
    console.log('✅ [DEBUG] Session cleared successfully');
    return { success: true };
  } catch (error) {
    console.error('💥 [DEBUG] Failed to reset session:', error);
    return { success: false };
  }
}

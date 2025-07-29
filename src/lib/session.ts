'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { PageSpeedResult } from '@/app/actions';
import { FunnelSession, sessionOptions } from './session-types';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<FunnelSession>(cookieStore, sessionOptions);
    
    // Check if session is expired (24 hours)
    if (session.timestamp && Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      await clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function updateSession(data: Partial<FunnelSession>) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<FunnelSession>(cookieStore, sessionOptions);
    
    // Merge new data with existing session data
    Object.assign(session, {
      ...data,
      timestamp: Date.now(),
    });
    
    await session.save();
    return session;
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<FunnelSession>(cookieStore, sessionOptions);
    session.destroy();
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

export async function validateSession(): Promise<FunnelSession | null> {
  const session = await getSession();
  
  if (!session || !session.url || !session.timestamp) {
    return null;
  }
  
  // Validate required fields based on step
  switch (session.step) {
    case 'url':
      return session.url ? session : null;
    case 'email':
      return session.url && session.analysis ? session : null;
    case 'results':
      return session.url && session.analysis && session.email ? session : null;
    default:
      return null;
  }
}

export async function initializeSession(url: string, analysis: PageSpeedResult): Promise<FunnelSession> {
  console.log('🔧 [DEBUG] Initializing session:', {
    url,
    performanceScore: analysis.performanceScore,
    timestamp: new Date().toISOString()
  });

  const sessionData: FunnelSession = {
    url,
    analysis,
    timestamp: Date.now(),
    step: 'email',
  };
  
  const result = await updateSession(sessionData);
  console.log('✅ [DEBUG] Session initialized successfully:', {
    step: result.step,
    hasUrl: !!result.url,
    hasAnalysis: !!result.analysis
  });
  
  return result;
}

export async function completeEmailStep(email: string): Promise<FunnelSession> {
  console.log('📧 [DEBUG] Completing email step:', { email, timestamp: new Date().toISOString() });
  
  const session = await getSession();
  console.log('🔍 [DEBUG] Current session state:', {
    hasSession: !!session,
    hasUrl: !!session?.url,
    hasAnalysis: !!session?.analysis,
    currentStep: session?.step,
    sessionAge: session?.timestamp ? Date.now() - session.timestamp : null
  });
  
  if (!session || !session.url || !session.analysis) {
    console.error('❌ [DEBUG] Invalid session state for email completion:', {
      hasSession: !!session,
      hasUrl: !!session?.url,
      hasAnalysis: !!session?.analysis
    });
    throw new Error('Invalid session state for email completion');
  }
  
  const updatedSession = await updateSession({
    email,
    step: 'results',
    completed: true,
  });
  
  console.log('✅ [DEBUG] Email step completed successfully:', {
    step: updatedSession.step,
    completed: updatedSession.completed,
    hasEmail: !!updatedSession.email
  });
  
  return updatedSession;
}
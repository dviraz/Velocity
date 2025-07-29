import { PageSpeedResult } from '@/app/actions';

export interface FunnelSession {
  url: string;
  email?: string;
  analysis?: PageSpeedResult;
  timestamp: number;
  step: 'url' | 'email' | 'results';
  completed?: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security',
  cookieName: 'velocitylab-funnel-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax' as const,
  },
};
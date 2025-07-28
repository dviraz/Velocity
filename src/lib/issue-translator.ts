export type IssueTranslation = {
  businessTitle: string;
  businessImpact: string;
  severity: 'Low' | 'Medium' | 'High';
  icon: string;
  businessValue: number; // 1-10 scale for prioritization
};

export type TranslatedIssue = {
  id: string;
  originalTitle: string;
  businessTitle: string;
  businessImpact: string;
  severity: 'Low' | 'Medium' | 'High';
  icon: string;
  businessValue: number;
};

// Business translation mapping for PageSpeed issues
const ISSUE_TRANSLATIONS: Record<string, IssueTranslation> = {
  'unused-css-rules': {
    businessTitle: 'Fix Render-Blocking Issues',
    businessImpact: 'This is forcing users to stare at a blank screen, costing you visitors and potential sales.',
    severity: 'High',
    icon: '🚫',
    businessValue: 9,
  },
  'efficiently-encode-images': {
    businessTitle: 'Optimize Image Loading',
    businessImpact: 'Heavy images are slowing down your site and increasing bounce rates, directly impacting conversions.',
    severity: 'High',
    icon: '🖼️',
    businessValue: 8,
  },
  'unminified-javascript': {
    businessTitle: 'Reduce JavaScript Load Times',
    businessImpact: 'Bloated code is making your pages load slowly, hurting user experience and search rankings.',
    severity: 'Medium',
    icon: '⚡',
    businessValue: 7,
  },
  'largest-contentful-paint-element': {
    businessTitle: 'Speed Up Main Content Loading',
    businessImpact: 'Your main content loads too slowly, causing visitors to leave before seeing your value proposition.',
    severity: 'High',
    icon: '🎯',
    businessValue: 9,
  },
  'render-blocking-resources': {
    businessTitle: 'Eliminate Render Blockers',
    businessImpact: 'Critical resources are delaying page display, creating a poor first impression for visitors.',
    severity: 'High',
    icon: '🔒',
    businessValue: 8,
  },
  'unminified-css': {
    businessTitle: 'Streamline Stylesheet Loading',
    businessImpact: 'Oversized stylesheets are slowing page rendering and negatively affecting user experience.',
    severity: 'Medium',
    icon: '🎨',
    businessValue: 6,
  },
  'unused-javascript': {
    businessTitle: 'Remove Unnecessary Code',
    businessImpact: 'Dead code is wasting bandwidth and slowing down your site, especially on mobile devices.',
    severity: 'Medium',
    icon: '🧹',
    businessValue: 6,
  },
  'legacy-javascript': {
    businessTitle: 'Modernize JavaScript Code',
    businessImpact: 'Outdated code is reducing performance and potentially blocking users on older devices.',
    severity: 'Low',
    icon: '🔄',
    businessValue: 4,
  },
  'cumulative-layout-shift': {
    businessTitle: 'Fix Layout Jumping',
    businessImpact: 'Content that moves around frustrates users and can cause accidental clicks, harming conversions.',
    severity: 'Medium',
    icon: '📱',
    businessValue: 7,
  },
  'non-composited-animations': {
    businessTitle: 'Optimize Visual Effects',
    businessImpact: 'Poorly optimized animations are causing janky scrolling and reducing perceived performance.',
    severity: 'Low',
    icon: '✨',
    businessValue: 3,
  },
};

// Fallback translation for unknown issues
const FALLBACK_TRANSLATION: IssueTranslation = {
  businessTitle: 'Performance Optimization Needed',
  businessImpact: 'This issue is affecting your website\'s speed and user experience, potentially impacting conversions.',
  severity: 'Medium',
  icon: '⚠️',
  businessValue: 5,
};

/**
 * Translates technical PageSpeed issues into business-focused language
 */
export function translateIssue(issue: {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}): TranslatedIssue {
  const translation = ISSUE_TRANSLATIONS[issue.id] || FALLBACK_TRANSLATION;
  
  return {
    id: issue.id,
    originalTitle: issue.title,
    businessTitle: translation.businessTitle,
    businessImpact: translation.businessImpact,
    severity: translation.severity,
    icon: translation.icon,
    businessValue: translation.businessValue,
  };
}

/**
 * Translates multiple issues and sorts them by business value (highest first)
 */
export function translateAndPrioritizeIssues(issues: Array<{
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}>): TranslatedIssue[] {
  return issues
    .map(translateIssue)
    .sort((a, b) => b.businessValue - a.businessValue);
}

/**
 * Gets performance score messaging based on score
 */
export function getPerformanceScoreMessage(score: number): {
  grade: string;
  message: string;
  color: string;
} {
  if (score >= 90) {
    return {
      grade: 'A',
      message: 'Excellent! Your website has outstanding performance. You\'re ahead of most competitors.',
      color: 'text-green-600',
    };
  } else if (score >= 70) {
    return {
      grade: 'B',
      message: 'Good performance, but there\'s room for improvement. Small optimizations could yield big results.',
      color: 'text-blue-600',
    };
  } else if (score >= 50) {
    return {
      grade: 'C',
      message: 'Average performance detected. Your website needs optimization to stay competitive.',
      color: 'text-yellow-600',
    };
  } else if (score >= 30) {
    return {
      grade: 'D',
      message: 'Poor performance detected. Immediate attention required to prevent visitor loss.',
      color: 'text-orange-600',
    };
  } else {
    return {
      grade: 'F',
      message: 'Critical performance issues detected. Your slow site is likely costing you significant revenue.',
      color: 'text-red-600',
    };
  }
}

/**
 * Estimates potential business impact based on performance score
 */
export function getBusinessImpactEstimate(score: number): {
  bounceRateIncrease: string;
  conversionImpact: string;
  seoImpact: string;
} {
  if (score >= 90) {
    return {
      bounceRateIncrease: '< 5%',
      conversionImpact: 'Minimal impact',
      seoImpact: 'Positive ranking factor',
    };
  } else if (score >= 70) {
    return {
      bounceRateIncrease: '5-15%',
      conversionImpact: '2-7% conversion loss',
      seoImpact: 'Neutral to slight negative',
    };
  } else if (score >= 50) {
    return {
      bounceRateIncrease: '15-25%',
      conversionImpact: '7-15% conversion loss',
      seoImpact: 'Negative ranking impact',
    };
  } else {
    return {
      bounceRateIncrease: '25-40%',
      conversionImpact: '15-30% conversion loss',
      seoImpact: 'Severe ranking penalty',
    };
  }
}
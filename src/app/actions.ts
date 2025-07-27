'use server';

import { analyzeWebsite, AnalyzeWebsiteOutput } from '@/ai/flows/analyze-website';
import { z } from 'zod';

const schema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type FormState = {
  message: string;
  analysis?: AnalyzeWebsiteOutput;
  isError: boolean;
};

export async function handleAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.url?.[0] || 'Invalid input.',
      isError: true,
    };
  }

  try {
    const result = await analyzeWebsite({ url: validatedFields.data.url });
    return {
      message: 'Analysis successful. See summary below.',
      analysis: result,
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred during analysis. The AI model may be unavailable. Please try again later.',
      isError: true,
    };
  }
}

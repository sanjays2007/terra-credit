'use server';

import { analyzeTraffic } from '@/ai/flows/analyze-traffic';

export async function getTrafficAnalysis(cameraId?: string) {
  try {
    const analysis = await analyzeTraffic(cameraId);
    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    console.error('Error analyzing traffic:', error);
    return {
      success: false,
      error: 'Failed to analyze traffic',
    };
  }
}

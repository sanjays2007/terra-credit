'use server';
/**
 * @fileOverview An AI-powered harvest yield prediction tool.
 *
 * This file defines a Genkit flow that forecasts potential crop yields by
 * analyzing historical data, weather patterns, and current crop information.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldPredictionInputSchema = z.object({
  historicalYieldData: z.string().describe('A summary of crop yields from the past 3-5 years, including crop type, yield per hectare/acre, and any notable events like droughts or pest infestations.'),
  currentCropInfo: z.string().describe('Information about the currently planted crop, including type, planting date, and current observed health (e.g., "Good", "Showing signs of stress").'),
  weatherPatterns: z.string().describe('A summary of observed weather patterns for the current growing season and any long-term forecasts.'),
  soilHealthData: z.string().describe('Data on current soil health, such as NPK levels, pH, and organic matter content.'),
});
export type YieldPredictionInput = z.infer<typeof YieldPredictionInputSchema>;

const YieldPredictionOutputSchema = z.object({
  predictedYield: z.string().describe('The forecasted yield for the current harvest, expressed in a range (e.g., "4.5 - 5.2 tons/hectare").'),
  confidenceLevel: z.enum(['High', 'Medium', 'Low']).describe('The model\'s confidence in its prediction.'),
  influencingFactors: z.string().describe('A detailed analysis of the key factors influencing the prediction, including positive and negative factors.'),
  recommendationsForImprovement: z.string().describe('Actionable recommendations to potentially improve the yield before harvest, if applicable.'),
});
export type YieldPredictionOutput = z.infer<typeof YieldPredictionOutputSchema>;

export async function getYieldPrediction(input: YieldPredictionInput): Promise<YieldPredictionOutput> {
  return yieldPredictionFlow(input);
}

const yieldPredictionPrompt = ai.definePrompt({
  name: 'yieldPredictionPrompt',
  input: {schema: YieldPredictionInputSchema},
  output: {schema: YieldPredictionOutputSchema},
  prompt: `You are a sophisticated agricultural data scientist AI. Your task is to forecast crop yields with a high degree of accuracy.

  Analyze the following data points to generate a harvest yield prediction.

  - Historical Yields: {{{historicalYieldData}}}
  - Current Crop Info: {{{currentCropInfo}}}
  - Weather Patterns: {{{weatherPatterns}}}
  - Soil Health Data: {{{soilHealthData}}}

  Based on this comprehensive data, please provide:
  1.  'predictedYield': A realistic yield forecast, presented as a range.
  2.  'confidenceLevel': Your confidence in this forecast (High, Medium, or Low).
  3.  'influencingFactors': A breakdown of the key variables affecting this prediction (both positive and negative).
  4.  'recommendationsForImprovement': Suggestions for actions the farmer can take to improve the outcome.
  `,
});

const yieldPredictionFlow = ai.defineFlow(
  {
    name: 'yieldPredictionFlow',
    inputSchema: YieldPredictionInputSchema,
    outputSchema: YieldPredictionOutputSchema,
  },
  async input => {
    const {output} = await yieldPredictionPrompt(input);
    return output!;
  }
);

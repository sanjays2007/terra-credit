'use server';
/**
 * @fileOverview An AI-powered fertilizer recommendation engine.
 *
 * This file defines a Genkit flow that recommends the optimal fertilizer blend
 * and application strategy based on soil test results and crop type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerRecommendationInputSchema = z.object({
  soilTestResults: z.string().describe('The results of a recent soil test, including N, P, K levels (in ppm or mg/kg), pH, and organic matter percentage.'),
  cropType: z.string().describe('The specific crop that will be planted (e.g., Maize, Wheat, Tomatoes).'),
  farmLocation: z.string().describe('The geographical location of the farm to consider regional soil characteristics.'),
});
export type FertilizerRecommendationInput = z.infer<typeof FertilizerRecommendationInputSchema>;

const FertilizerRecommendationOutputSchema = z.object({
  npkRecommendation: z.string().describe('The recommended N-P-K (Nitrogen-Phosphorus-Potassium) ratio for the fertilizer blend (e.g., "10-20-10").'),
  applicationStrategy: z.string().describe('A detailed strategy for fertilizer application, including timing (e.g., pre-planting, top-dressing at growth stages) and method (e.g., broadcast, banding).'),
  micronutrientNeeds: z.string().describe('An analysis of potential micronutrient deficiencies (e.g., Zinc, Iron, Boron) and recommendations for addressing them.'),
  justification: z.string().describe('A clear explanation of why this specific blend and strategy are recommended based on the provided soil data and crop needs.'),
});
export type FertilizerRecommendationOutput = z.infer<typeof FertilizerRecommendationOutputSchema>;

export async function getFertilizerRecommendation(input: FertilizerRecommendationInput): Promise<FertilizerRecommendationOutput> {
  return fertilizerRecommendationFlow(input);
}

const fertilizerRecommendationPrompt = ai.definePrompt({
  name: 'fertilizerRecommendationPrompt',
  input: {schema: FertilizerRecommendationInputSchema},
  output: {schema: FertilizerRecommendationOutputSchema},
  prompt: `You are an expert agronomist AI specializing in soil science and crop nutrition.

  Your task is to create a tailored fertilizer recommendation based on the following data.

  - Crop Type: {{{cropType}}}
  - Soil Test Results: {{{soilTestResults}}}
  - Farm Location: {{{farmLocation}}}

  Analyze the soil test results in the context of the specific crop's nutritional requirements.
  
  Please provide:
  1.  'npkRecommendation': The ideal N-P-K ratio for a fertilizer blend.
  2.  'applicationStrategy': A detailed plan for when and how to apply the fertilizer.
  3.  'micronutrientNeeds': Any recommendations for supplemental micronutrients.
  4.  'justification': A scientific explanation for your recommendations, linking the soil data to the crop's needs.
  `,
});

const fertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'fertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await fertilizerRecommendationFlow(input);
    return output!;
  }
);

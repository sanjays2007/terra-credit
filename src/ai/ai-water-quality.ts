
// src/ai/ai-water-quality.ts
'use server';
/**
 * @fileOverview AI-driven water quality analysis for aquaculture.
 *
 * This file defines a Genkit flow that analyzes water quality parameters
 * and provides recommendations for maintaining a healthy aquatic environment for specific fish species.
 */

import {ai} from '@/ai/genkit';
import {
    WaterQualityInput,
    WaterQualityInputSchema,
    WaterQualityOutput,
    WaterQualityOutputSchema
} from './schemas/water-quality';

// Define the main function that calls the flow
export async function analyzeWaterQuality(input: WaterQualityInput): Promise<WaterQualityOutput> {
  return waterQualityFlow(input);
}

// Define the Genkit prompt
const waterQualityPrompt = ai.definePrompt({
  name: 'waterQualityPrompt',
  input: {schema: WaterQualityInputSchema},
  output: {schema: WaterQualityOutputSchema},
  prompt: `You are an expert aquaculture consultant specializing in water quality management.

  Based on the following water quality parameters for a pond containing {{fishSpecies}}, determine if the conditions are optimal. Provide a detailed analysis of each parameter and give actionable recommendations for improvement or maintenance.

  - pH: {{ph}}
  - Dissolved Oxygen: {{oxygen}} mg/L
  - Temperature: {{temperature}} °C
  - Turbidity: {{turbidity}} NTU
  - Ammonia: {{ammonia}} ppm
  - Nitrate: {{nitrate}} ppm

  Optimal ranges for most warm-water species like Tilapia, Catla, and Rohu are generally:
  - pH: 6.5 - 8.5
  - Dissolved Oxygen: > 5 mg/L
  - Temperature: 25 - 32 °C
  - Ammonia: < 0.5 ppm
  - Nitrate: < 50 ppm
  - Turbidity: < 30 NTU

  First, set the 'isOptimal' boolean field. It should be true ONLY if ALL parameters are within a healthy range for the given species.
  Then, provide a concise 'analysis' of the current state based on the provided data.
  Finally, provide a set of clear, actionable 'recommendations'. If a parameter is off, explain how to fix it (e.g., 'Aerate the pond to increase dissolved oxygen.'). If all parameters are good, recommend how to maintain them.
  `,
});

// Define the Genkit flow
const waterQualityFlow = ai.defineFlow(
  {
    name: 'waterQualityFlow',
    inputSchema: WaterQualityInputSchema,
    outputSchema: WaterQualityOutputSchema,
  },
  async input => {
    const {output} = await waterQualityPrompt(input);
    return output!;
  }
);

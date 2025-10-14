'use server';
/**
 * @fileOverview A crop planning AI agent that provides recommendations for crop planning and rotation schedules based on farm data.
 *
 * - getCropPlan - A function that handles the crop planning process.
 * - CropPlanInput - The input type for the getCropPlan function.
 * - CropPlanOutput - The return type for the getCropPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropPlanInputSchema = z.object({
  farmLocation: z
    .string()
    .describe('The geographical location of the farm (e.g., latitude, longitude, or city/region).'),
  soilHealthData: z
    .string()
    .describe('Data on soil health, including NPK levels, pH analysis, and organic matter content.'),
  weatherPatterns: z
    .string()
    .describe('Historical weather patterns and forecasts for the farm location, including rainfall and temperature trends.'),
  historicalYieldData: z
    .string()
    .describe('Historical crop yield data for the farm over the past few seasons.'),
  availableCrops: z
    .string()
    .describe('A list of crops the farmer is considering or has available to plant.'),
});
export type CropPlanInput = z.infer<typeof CropPlanInputSchema>;

const CropPlanOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe('A list of the top recommended crops for the next planting season, with a brief justification for each.'),
  rotationSchedule: z
    .string()
    .describe(
      'A recommended crop rotation schedule for the next 2-3 seasons to maintain soil health and maximize yield.'
    ),
  justification: z
    .string()
    .describe(
      'A detailed justification for the recommendations, explaining how the data was used to arrive at the conclusions.'
    ),
});
export type CropPlanOutput = z.infer<typeof CropPlanOutputSchema>;

export async function getCropPlan(input: CropPlanInput): Promise<CropPlanOutput> {
  return cropPlanFlow(input);
}

const cropPlanPrompt = ai.definePrompt({
  name: 'cropPlanPrompt',
  input: {schema: CropPlanInputSchema},
  output: {schema: CropPlanOutputSchema},
  prompt: `You are an expert agronomist AI specializing in crop planning for small to medium-sized farms.

  Analyze the following farm data to generate an optimal crop plan. The plan should maximize yield, promote soil health, and be resilient to local weather patterns.

  - Farm Location: {{{farmLocation}}}
  - Soil Health Data: {{{soilHealthData}}}
  - Weather Patterns: {{{weatherPatterns}}}
  - Historical Yields: {{{historicalYieldData}}}
  - Available Crops: {{{availableCrops}}}

  Please provide:
  1.  'recommendedCrops': Suggest the best crops for the upcoming season.
  2.  'rotationSchedule': Propose a multi-season rotation plan.
  3.  'justification': Explain your reasoning in detail, referencing the provided data.
  `,
});

const cropPlanFlow = ai.defineFlow(
  {
    name: 'cropPlanFlow',
    inputSchema: CropPlanInputSchema,
    outputSchema: CropPlanOutputSchema,
  },
  async input => {
    const {output} = await cropPlanPrompt(input);
    return output!;
  }
);

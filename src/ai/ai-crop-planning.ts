// This file is machine-generated - edit with caution!
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
    .describe('The geographical location of the farm (e.g., latitude, longitude).'),
  soilHealthData: z
    .string()
    .describe('Data on soil health, including NPK levels and pH analysis.'),
  weatherPatterns: z
    .string()
    .describe('Historical weather patterns and forecasts for the farm location.'),
  historicalYieldData: z
    .string()
    .describe('Historical crop yield data for the farm.'),
  crops: z
    .string()
    .describe('List of crop names that the farmer has available to plant.'),
});
export type CropPlanInput = z.infer<typeof CropPlanInputSchema>;

const CropPlanOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe('Recommended crops for the next planting season.'),
  rotationSchedule: z
    .string()
    .describe('Recommended crop rotation schedule for the next few years.'),
  plantingStrategy: z
    .string()
    .describe('Specific planting strategies to maximize yields.'),
  riskAssessment: z.string().describe('Risks.'),
});
export type CropPlanOutput = z.infer<typeof CropPlanOutputSchema>;

export async function getCropPlan(input: CropPlanInput): Promise<CropPlanOutput> {
  return cropPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropPlanPrompt',
  input: {schema: CropPlanInputSchema},
  output: {schema: CropPlanOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided farm data, recommend the best crops, rotation schedule, planting strategies, and risk assessment for the farmer.

Farm Location: {{{farmLocation}}}
Soil Health Data: {{{soilHealthData}}}
Weather Patterns: {{{weatherPatterns}}}
Historical Yield Data: {{{historicalYieldData}}}
Crops: {{{crops}}}

Consider all the provided information to provide the best recommendations.
`,
});

const cropPlanFlow = ai.defineFlow(
  {
    name: 'cropPlanFlow',
    inputSchema: CropPlanInputSchema,
    outputSchema: CropPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview An AI-powered feed recommendation engine for livestock.
 *
 * This file defines a Genkit flow that recommends an optimal feed blend
 * and daily intake based on an animal's specific characteristics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeedRecommendationInputSchema = z.object({
  breed: z.string().describe('The breed of the animal (e.g., "Gir", "Sahiwal", "Holstein Friesian").'),
  age: z.number().describe('The age of the animal in years.'),
  weight: z.number().describe('The current weight of the animal in kilograms.'),
  healthStatus: z.string().describe('The current health status (e.g., "Healthy", "Sick", "Monitoring").'),
  productionGoal: z.string().describe('The primary production goal for this animal (e.g., "Lactation", "Weight Gain", "Maintenance").'),
});
export type FeedRecommendationInput = z.infer<typeof FeedRecommendationInputSchema>;

const FeedRecommendationOutputSchema = z.object({
  totalDailyIntake: z.string().describe('The total recommended daily feed intake in kilograms (e.g., "15-18 kg/day").'),
  feedComposition: z.string().describe('A breakdown of the recommended feed composition, specifying percentages of components like forage, concentrates, and protein supplements.'),
  justification: z.string().describe('A clear explanation for the recommendation, referencing the animal\'s specific data like age, breed, and production goal.'),
});
export type FeedRecommendationOutput = z.infer<typeof FeedRecommendationOutputSchema>;

export async function getFeedRecommendation(input: FeedRecommendationInput): Promise<FeedRecommendationOutput> {
  return feedRecommendationFlow(input);
}

const feedRecommendationPrompt = ai.definePrompt({
  name: 'feedRecommendationPrompt',
  input: {schema: FeedRecommendationInputSchema},
  output: {schema: FeedRecommendationOutputSchema},
  prompt: `You are an expert livestock nutritionist AI.

  Your task is to create a tailored feed recommendation for an individual animal based on the following data.

  - Breed: {{{breed}}}
  - Age: {{{age}}} years
  - Weight: {{{weight}}} kg
  - Health Status: {{{healthStatus}}}
  - Production Goal: {{{productionGoal}}}

  Analyze this data to determine the optimal diet for this animal's needs.
  
  Please provide:
  1.  'totalDailyIntake': The total amount of feed the animal should consume daily, as a range.
  2.  'feedComposition': A detailed breakdown of the ideal feed mix. Be specific about the types of feed (e.g., Alfalfa hay, corn silage, soybean meal) and their percentages.
  3.  'justification': A scientific explanation for your recommendation, linking the animal's data to the nutritional plan. For example, explain why a lactating cow needs more protein or why an older animal might need a different mineral balance.
  `,
});

const feedRecommendationFlow = ai.defineFlow(
  {
    name: 'feedRecommendationFlow',
    inputSchema: FeedRecommendationInputSchema,
    outputSchema: FeedRecommendationOutputSchema,
  },
  async input => {
    const {output} = await feedRecommendationPrompt(input);
    return output!;
  }
);

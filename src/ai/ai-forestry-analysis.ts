'use server';
/**
 * @fileOverview AI-driven forestry analysis.
 *
 * This file defines a Genkit flow that analyzes tree inventory data
 * and provides analysis and recommendations for forest management.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schema for the input
const ForestryAnalysisInputSchema = z.object({
  inventoryData: z.string().describe('A JSON string representing an array of tree objects. Each object should have keys like species, biomass, carbonSeq, etc.'),
});
export type ForestryAnalysisInput = z.infer<typeof ForestryAnalysisInputSchema>;

// Define Zod schema for the output
const ForestryAnalysisOutputSchema = z.object({
  totalTimberValue: z.number().describe("The estimated total market value of the timber in USD."),
  totalCarbonSequestration: z.number().describe("The total carbon sequestration in kilograms of CO2e."),
  mostValuableSpecies: z.string().describe("The species with the highest contribution to the total timber value."),
  harvestRecommendations: z.string().describe("Specific recommendations on which trees or species are prime for harvesting based on age, size, and market value."),
  growthPriorities: z.string().describe("Recommendations on which species or areas to prioritize for future growth and investment."),
  overallAnalysis: z.string().describe('A summary analysis of the entire inventory, covering health, economic potential, and ecological impact.'),
});
export type ForestryAnalysisOutput = z.infer<typeof ForestryAnalysisOutputSchema>;

// Define the main function that calls the flow
export async function analyzeForestryInventory(input: ForestryAnalysisInput): Promise<ForestryAnalysisOutput> {
  return forestryAnalysisFlow(input);
}

// Define the Genkit prompt
const forestryAnalysisPrompt = ai.definePrompt({
  name: 'forestryAnalysisPrompt',
  input: {schema: ForestryAnalysisInputSchema},
  output: {schema: ForestryAnalysisOutputSchema},
  prompt: `You are an expert forestry management consultant AI.

  Based on the following tree inventory data, provide a detailed quantitative analysis and actionable recommendations.
  Assume a generic timber value of $2.5 per kg of biomass for valuation purposes.

  Tree Inventory Data (JSON): {{{inventoryData}}}

  Please provide:
  1. 'totalTimberValue': Calculate the total value by summing the (biomass * 2.5) for all trees.
  2. 'totalCarbonSequestration': Calculate the sum of 'carbonSeq' for all trees.
  3. 'mostValuableSpecies': Identify the species that contributes the most to the total timber value.
  4. 'harvestRecommendations': Suggest which trees are good candidates for harvesting (consider older trees or those with high biomass).
  5. 'growthPriorities': Suggest which species or younger trees should be nurtured for future value.
  6. 'overallAnalysis': A detailed summary of the inventory's strengths, weaknesses, and potential.
  `,
});

// Define the Genkit flow
const forestryAnalysisFlow = ai.defineFlow(
  {
    name: 'forestryAnalysisFlow',
    inputSchema: ForestryAnalysisInputSchema,
    outputSchema: ForestryAnalysisOutputSchema,
  },
  async input => {
    const {output} = await forestryAnalysisPrompt(input);
    return output!;
  }
);

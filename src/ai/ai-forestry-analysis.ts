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
  analysis: z.string().describe('A detailed analysis of the timber value, carbon sequestration potential, and overall forest health.'),
  recommendations: z.string().describe('Actionable recommendations for improving forest health, value, and carbon sequestration.'),
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
  prompt: `You are an expert forestry management consultant.

  Based on the following tree inventory data, provide a detailed analysis and actionable recommendations.
  The analysis should cover timber value, carbon sequestration, and overall forest health.
  The recommendations should focus on sustainable practices to improve economic value and ecological impact.

  Tree Inventory Data (JSON): {{{inventoryData}}}

  Please provide a detailed 'analysis' and a set of 'recommendations'.
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

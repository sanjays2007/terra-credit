// src/ai/ai-credit-scoring.ts
'use server';
/**
 * @fileOverview AI-driven credit scoring flow for farmers.
 *
 * This file defines a Genkit flow that generates a credit score based on farm performance data,
 * satellite imagery analysis, and other relevant factors. It exports the `generateCreditScore`
 * function, the `CreditScoreInput` type, and the `CreditScoreOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schema for the input
const CreditScoreInputSchema = z.object({
  farmPerformanceData: z.string().describe('Historical data on crop yields, livestock production, and other farm activities.'),
  satelliteImageryAnalysis: z.string().describe('Analysis of satellite imagery related to the farm, including NDVI and other vegetation indices.'),
  financialData: z.string().describe('Financial information about the farmer, such as income, expenses, and debt.'),
  farmerProfile: z.string().describe('Information about the farmer, such as experience, education, and farming practices.'),
});
export type CreditScoreInput = z.infer<typeof CreditScoreInputSchema>;

// Define Zod schema for the output
const CreditScoreOutputSchema = z.object({
  creditScore: z.number().describe('The calculated credit score for the farmer.'),
  riskFactors: z.string().describe('An explanation of the factors that influenced the credit score.'),
  recommendations: z.string().describe('Recommendations for improving the credit score.'),
});
export type CreditScoreOutput = z.infer<typeof CreditScoreOutputSchema>;

// Define the main function that calls the flow
export async function generateCreditScore(input: CreditScoreInput): Promise<CreditScoreOutput> {
  return creditScoreFlow(input);
}

// Define the Genkit prompt
const creditScorePrompt = ai.definePrompt({
  name: 'creditScorePrompt',
  input: {schema: CreditScoreInputSchema},
  output: {schema: CreditScoreOutputSchema},
  prompt: `You are an AI-powered credit scoring system for farmers.

  Based on the following information, generate a credit score for the farmer and explain the risk factors and provide recommendations for improvement.

  Farm Performance Data: {{{farmPerformanceData}}}
  Satellite Imagery Analysis: {{{satelliteImageryAnalysis}}}
  Financial Data: {{{financialData}}}
  Farmer Profile: {{{farmerProfile}}}

  Please provide the credit score, risk factors, and recommendations in a clear and concise manner.
  The credit score should be a number between 0 and 1000.
  The risk factors should explain the main reasons for the assigned credit score.
  The recommendations should provide actionable steps for the farmer to improve their score.
  `,
});

// Define the Genkit flow
const creditScoreFlow = ai.defineFlow(
  {
    name: 'creditScoreFlow',
    inputSchema: CreditScoreInputSchema,
    outputSchema: CreditScoreOutputSchema,
  },
  async input => {
    const {output} = await creditScorePrompt(input);
    return output!;
  }
);

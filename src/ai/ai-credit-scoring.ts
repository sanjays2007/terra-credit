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
  creditScore: z.number().describe('The calculated credit score for the farmer, on a scale of 300 to 850.'),
  riskFactors: z.string().describe('An explanation of the key factors that influenced the credit score.'),
  recommendations: z.string().describe('Actionable recommendations for improving the credit score.'),
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
  prompt: `You are an AI-powered credit scoring system for agricultural lenders.

  Based on the following information, generate a credit score for the farmer. The score should be on a scale from 300 to 850.
  Also, explain the primary risk factors and provide actionable recommendations for improvement.

  Farm Performance Data: {{{farmPerformanceData}}}
  Satellite Imagery Analysis: {{{satelliteImageryAnalysis}}}
  Financial Data: {{{financialData}}}
  Farmer Profile: {{{farmerProfile}}}

  Please provide the credit score, risk factors, and recommendations.
  - The credit score must be a number between 300 and 850.
  - The risk factors should clearly explain the main reasons for the assigned score.
  - The recommendations should provide clear, actionable steps for the farmer to improve their score.
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

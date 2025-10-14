
'use server';
/**
 * @fileOverview An AI assistant for designing and analyzing on-farm A/B experiments.
 *
 * This flow helps farmers structure experiments and then analyzes the results
 * to provide a clear conclusion on the effectiveness of the tested variable.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Schema for the design phase
const ABTestDesignInputSchema = z.object({
  objective: z.string().describe('What the farmer wants to test (e.g., "Test a new organic fertilizer against my current one").'),
  crop: z.string().describe('The crop involved in the experiment (e.g., "Wheat").'),
  metrics: z.string().describe('How success will be measured (e.g., "Yield in kg/acre, instances of pest attacks").'),
  farmSize: z.string().describe('The size of the farm or plot available for the test.'),
});
export type ABTestDesignInput = z.infer<typeof ABTestDesignInputSchema>;

const ABTestDesignOutputSchema = z.object({
  experimentalDesign: z.string().describe('A step-by-step plan for setting up the experiment, including plot division, control/variable group setup, and data collection methods.'),
  potentialBiases: z.string().describe('A list of potential biases or confounding factors to be aware of during the experiment (e.g., soil variation, water drainage differences).'),
});
export type ABTestDesignOutput = z.infer<typeof ABTestDesignOutputSchema>;

// Schema for the analysis phase
const ABTestAnalysisInputSchema = z.object({
  originalObjective: z.string().describe('The objective from the design phase.'),
  controlGroupResults: z.string().describe('The collected data and observations from the control group (Group A).'),
  variableGroupResults: z.string().describe('The collected data and observations from the variable/test group (Group B).'),
});
export type ABTestAnalysisInput = z.infer<typeof ABTestAnalysisInputSchema>;

const ABTestAnalysisOutputSchema = z.object({
  conclusion: z.string().describe('A clear conclusion on whether the variable had a statistically significant effect.'),
  recommendation: z.string().describe('An actionable recommendation based on the conclusion (e.g., "Adopt the new fertilizer for all wheat crops next season.").'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('The AI\'s confidence in the conclusion based on the quality of the data provided.'),
});
export type ABTestAnalysisOutput = z.infer<typeof ABTestAnalysisOutputSchema>;


// Design Flow
export async function designAbTest(input: ABTestDesignInput): Promise<ABTestDesignOutput> {
  return abTestDesignFlow(input);
}

const abTestDesignPrompt = ai.definePrompt({
  name: 'abTestDesignPrompt',
  input: {schema: ABTestDesignInputSchema},
  output: {schema: ABTestDesignOutputSchema},
  prompt: `You are a data scientist specializing in agricultural research. A farmer wants to run an experiment. Your task is to provide a simple, practical experimental design.

  **Experimental Goal:**
  - Objective: {{{objective}}}
  - Crop: {{{crop}}}
  - Key Metrics: {{{metrics}}}
  - Available Area: {{{farmSize}}}

  Please generate:
  1. 'experimentalDesign': A clear, step-by-step guide for the farmer to set up two plots (Control Group A, Test Group B). Explain how to apply the variable, what data to collect, and when.
  2. 'potentialBiases': List 2-3 important factors the farmer should try to keep consistent between the plots to ensure a fair test.
  `,
});

const abTestDesignFlow = ai.defineFlow(
  {
    name: 'abTestDesignFlow',
    inputSchema: ABTestDesignInputSchema,
    outputSchema: ABTestDesignOutputSchema,
  },
  async input => {
    const {output} = await abTestDesignPrompt(input);
    return output!;
  }
);


// Analysis Flow
export async function analyzeAbTest(input: ABTestAnalysisInput): Promise<ABTestAnalysisOutput> {
  return abTestAnalysisFlow(input);
}

const abTestAnalysisPrompt = ai.definePrompt({
  name: 'abTestAnalysisPrompt',
  input: {schema: ABTestAnalysisInputSchema},
  output: {schema: ABTestAnalysisOutputSchema},
  prompt: `You are a data scientist specializing in agricultural research. A farmer has completed an experiment and provided the results. Your task is to analyze the data.

  **Experiment Details:**
  - Original Objective: {{{originalObjective}}}
  - Control Group A Results: {{{controlGroupResults}}}
  - Test Group B Results: {{{variableGroupResults}}}

  Analyze the results to determine the outcome of the experiment.
  
  Please provide:
  1. 'conclusion': A clear, straightforward conclusion. Did the variable make a positive, negative, or negligible difference?
  2. 'recommendation': Based on your conclusion, what should the farmer do next?
  3. 'confidence': State your confidence (High, Medium, or Low) in the conclusion, considering the data provided. If the data is purely anecdotal, confidence will likely be Low.
  `,
});

const abTestAnalysisFlow = ai.defineFlow(
  {
    name: 'abTestAnalysisFlow',
    inputSchema: ABTestAnalysisInputSchema,
    outputSchema: ABTestAnalysisOutputSchema,
  },
  async input => {
    const {output} = await abTestAnalysisPrompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview A livestock health diagnosis AI agent.
 *
 * - diagnoseLivestock - A function that handles the livestock diagnosis process.
 * - DiagnoseLivestockInput - The input type for the diagnoseLivestock function.
 * - DiagnoseLivestockOutput - The return type for the diagnoseLivestock function.
 */

import {ai} from '@/ai/genkit';
import {
    DiagnoseLivestockInput,
    DiagnoseLivestockInputSchema,
    DiagnoseLivestockOutput,
    DiagnoseLivestockOutputSchema
} from '../schemas/livestock-diagnosis';

export async function diagnoseLivestock(input: DiagnoseLivestockInput): Promise<DiagnoseLivestockOutput> {
  return diagnoseLivestockFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseLivestockPrompt',
  input: {schema: DiagnoseLivestockInputSchema},
  output: {schema: DiagnoseLivestockOutputSchema},
  prompt: `You are an expert veterinarian specializing in livestock health.

You will use the provided photo and description to make a preliminary health assessment of the animal.

- Analyze the image for visual cues (e.g., posture, coat condition, signs of injury, lethargy).
- Analyze the description for reported symptoms.
- Based on all information, determine a potential health status and provide a clear, actionable preliminary diagnosis and recommendation.

Use the following as the primary source of information about the animal.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const diagnoseLivestockFlow = ai.defineFlow(
  {
    name: 'diagnoseLivestockFlow',
    inputSchema: DiagnoseLivestockInputSchema,
    outputSchema: DiagnoseLivestockOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

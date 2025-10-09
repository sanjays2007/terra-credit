'use server';

/**
 * @fileOverview Summarizes recommendations from an uploaded extension office PDF into actionable steps.
 *
 * - summarizeAdvisory - A function that handles the summarization process.
 * - SummarizeAdvisoryInput - The input type for the summarizeAdvisory function.
 * - SummarizeAdvisoryOutput - The return type for the summarizeAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAdvisoryInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document content as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type SummarizeAdvisoryInput = z.infer<typeof SummarizeAdvisoryInputSchema>;

const SummarizeAdvisoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the actionable steps recommended in the document.'),
});
export type SummarizeAdvisoryOutput = z.infer<typeof SummarizeAdvisoryOutputSchema>;

export async function summarizeAdvisory(input: SummarizeAdvisoryInput): Promise<SummarizeAdvisoryOutput> {
  return summarizeAdvisoryFlow(input);
}

const summarizeAdvisoryPrompt = ai.definePrompt({
  name: 'summarizeAdvisoryPrompt',
  input: {schema: SummarizeAdvisoryInputSchema},
  output: {schema: SummarizeAdvisoryOutputSchema},
  prompt: `You are an AI assistant that helps farmers understand recommendations from agricultural extension offices.\n\nYou will receive a PDF document as input. Your task is to summarize the actionable steps recommended in the document so that farmers can easily understand and implement them.\n\nHere is the PDF document: {{media url=pdfDataUri}}`,
});

const summarizeAdvisoryFlow = ai.defineFlow(
  {
    name: 'summarizeAdvisoryFlow',
    inputSchema: SummarizeAdvisoryInputSchema,
    outputSchema: SummarizeAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeAdvisoryPrompt(input);
    return output!;
  }
);

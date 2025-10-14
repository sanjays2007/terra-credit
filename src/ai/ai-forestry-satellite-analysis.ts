
'use server';
/**
 * @fileOverview AI-driven analysis of simulated satellite imagery for forest health.
 *
 * This flow interprets vegetation descriptions and simulated NDVI values
 * to assess forest health, identify potential issues, and recommend actions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schema for the input
const ForestrySatelliteInputSchema = z.object({
  sector: z.string().describe('The specific forest sector or plot being analyzed (e.g., "Sector 4D").'),
  vegetationDescription: z.string().describe('A ground-truth description of the vegetation\'s appearance (e.g., "Canopy looks thin, some yellowing visible.").'),
  simulatedNdvi: z.string().describe('The simulated Normalized Difference Vegetation Index (NDVI) value for the sector, typically ranging from -1 to +1. Higher values (e.g., 0.6 to 0.9) indicate healthy, dense vegetation.'),
});
export type ForestrySatelliteInput = z.infer<typeof ForestrySatelliteInputSchema>;

// Define Zod schema for the output
const ForestrySatelliteOutputSchema = z.object({
  healthAssessment: z.enum(['Healthy', 'Moderate Stress', 'Severe Stress', 'Potential Disease']).describe('A one-word assessment of the forest sector\'s health.'),
  potentialIssues: z.string().describe('A detailed analysis of potential issues based on the data, such as water stress, nutrient deficiency, or pest infestation.'),
  recommendations: z.string().describe('Actionable recommendations for ground-truthing and intervention (e.g., "Recommend soil moisture testing in Sector 4D," "Schedule a drone inspection to check for bark beetle activity.").'),
  analysisSummary: z.string().describe('A summary that synthesizes the input data and explains the reasoning for the assessment and recommendations.'),
});
export type ForestrySatelliteOutput = z.infer<typeof ForestrySatelliteOutputSchema>;

// Define the main function that calls the flow
export async function analyzeSatelliteImagery(input: ForestrySatelliteInput): Promise<ForestrySatelliteOutput> {
  return forestrySatelliteAnalysisFlow(input);
}

// Define the Genkit prompt
const forestrySatelliteAnalysisPrompt = ai.definePrompt({
  name: 'forestrySatelliteAnalysisPrompt',
  input: {schema: ForestrySatelliteInputSchema},
  output: {schema: ForestrySatelliteOutputSchema},
  prompt: `You are a remote sensing and forestry expert AI. Your task is to analyze simulated satellite data to assess the health of a forest sector.

  **Sector Data:**
  - Sector ID: {{{sector}}}
  - Ground Observation: {{{vegetationDescription}}}
  - Simulated NDVI Value: {{{simulatedNdvi}}}

  **NDVI Interpretation Guide:**
  - NDVI > 0.6: Healthy, dense vegetation.
  - NDVI 0.2 to 0.5: Moderate vegetation, possible stress or sparse canopy.
  - NDVI < 0.2: Very sparse or unhealthy vegetation.

  **Your Task:**
  Based on the combination of the ground observation and the NDVI value, perform a health assessment.

  1.  **'healthAssessment'**: Choose one of the following: 'Healthy', 'Moderate Stress', 'Severe Stress', 'Potential Disease'.
  2.  **'potentialIssues'**: Identify the most likely problems. A low NDVI with reports of yellowing might suggest nutrient deficiency, while a sudden drop could indicate pest infestation.
  3.  **'recommendations'**: Suggest concrete, actionable steps for the ground team. Be specific (e.g., "Deploy soil moisture sensors," "Collect leaf samples for lab analysis").
  4.  **'analysisSummary'**: Explain your reasoning. For example, "The low NDVI of {{{simulatedNdvi}}} combined with field reports of yellowing leaves points towards a likely nitrogen deficiency..."
  `,
});

// Define the Genkit flow
const forestrySatelliteAnalysisFlow = ai.defineFlow(
  {
    name: 'forestrySatelliteAnalysisFlow',
    inputSchema: ForestrySatelliteInputSchema,
    outputSchema: ForestrySatelliteOutputSchema,
  },
  async input => {
    const {output} = await forestrySatelliteAnalysisPrompt(input);
    return output!;
  }
);

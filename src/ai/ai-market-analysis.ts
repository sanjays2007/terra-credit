
'use server';
/**
 * @fileOverview An AI-powered market analysis tool for agricultural products.
 *
 * This flow simulates fetching and analyzing market data to provide farmers
 * with price trends, demand forecasts, and strategic selling recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const MarketAnalysisInputSchema = z.object({
  cropType: z.string().describe('The crop to be analyzed (e.g., "Tomatoes", "Wheat", "Cotton").'),
  harvestMonth: z.string().describe('The expected month of harvest (e.g., "October").'),
  region: z.string().describe('The market region for the analysis (e.g., "Gujarat, India", "Midwest USA").'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
  priceTrendAnalysis: z.string().describe('An analysis of the historical and projected price trends for the crop in the specified region.'),
  demandForecast: z.string().describe('A forecast of market demand around the harvest month.'),
  sellingRecommendation: z.string().describe('A strategic recommendation on whether to sell immediately at harvest, store for a period, or seek contracts.'),
  keyFactors: z.string().describe('The key factors influencing the market, such as weather, import/export policies, and consumer trends.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

export async function getMarketAnalysis(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}

const marketAnalysisPrompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: {schema: MarketAnalysisInputSchema},
  output: {schema: MarketAnalysisOutputSchema},
  prompt: `You are a sophisticated agricultural market analyst AI. Your task is to provide a market analysis for a farmer based on simulated data.

  **Analysis Request:**
  - Crop: {{{cropType}}}
  - Expected Harvest: {{{harvestMonth}}}
  - Market Region: {{{region}}}

  **Your Task:**
  Based on simulated historical data, global market trends, and regional factors, generate a comprehensive market analysis. Do not state that the data is simulated. Present the analysis as if you are accessing live market data feeds.

  Please provide:
  1.  'priceTrendAnalysis': Analyze price fluctuations over the last season and project trends for the upcoming harvest period.
  2.  'demandForecast': Forecast the demand for this crop. Consider factors like festive seasons, processing industry needs, and supply from other regions.
  3.  'sellingRecommendation': Provide a clear, strategic recommendation. Should the farmer sell immediately? Store the produce for a potential price increase? Or look for pre-harvest contracts?
  4.  'keyFactors': List the top 3-4 factors that are currently influencing the market for this crop.
  `,
});

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async input => {
    const {output} = await marketAnalysisPrompt(input);
    return output!;
  }
);

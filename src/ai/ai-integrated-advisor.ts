
'use server';
/**
 * @fileOverview An integrated farm operations advisor AI.
 *
 * This flow acts as a master coordinator, using other AI tools to generate
 * a comprehensive operational plan for a specific crop over a season.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getCropPlan, type CropPlanOutput } from './ai-crop-planning';
import { getFertilizerRecommendation, type FertilizerRecommendationOutput } from './ai-fertilizer-recommendation';
import { getIrrigationSchedule, type IrrigationScheduleOutput } from './ai-irrigation-scheduling';
import { getYieldPrediction, type YieldPredictionOutput } from './ai-yield-prediction';
import { format } from 'date-fns';

const IntegratedAdvisorInputSchema = z.object({
  cropType: z.string().describe('The primary crop to plan for (e.g., "Maize").'),
  farmLocation: z.string().describe('The geographical location of the farm.'),
  soilHealthData: z.string().describe('Data on soil health (NPK, pH, etc.).'),
  historicalYieldData: z.string().describe('Historical yield data for the farm.'),
  weatherPatterns: z.string().describe('Typical weather patterns for the region.'),
  availableCrops: z.string().describe('A list of other available crops for rotation.'),
});
export type IntegratedAdvisorInput = z.infer<typeof IntegratedAdvisorInputSchema>;

const IntegratedAdvisorOutputSchema = z.object({
  executiveSummary: z.string().describe('A high-level overview of the entire operational plan.'),
  cropPlan: z.custom<CropPlanOutput>(),
  fertilizerPlan: z.custom<FertilizerRecommendationOutput>(),
  irrigationPlan: z.custom<IrrigationScheduleOutput>(),
  yieldPrediction: z.custom<YieldPredictionOutput>(),
});
export type IntegratedAdvisorOutput = z.infer<typeof IntegratedAdvisorOutputSchema>;

export async function getIntegratedPlan(input: IntegratedAdvisorInput): Promise<IntegratedAdvisorOutput> {
  return integratedAdvisorFlow(input);
}

const integratedAdvisorFlow = ai.defineFlow(
  {
    name: 'integratedAdvisorFlow',
    inputSchema: IntegratedAdvisorInputSchema,
    outputSchema: IntegratedAdvisorOutputSchema,
  },
  async (input) => {
    // 1. Get the Crop Plan
    const cropPlan = await getCropPlan({
        farmLocation: input.farmLocation,
        soilHealthData: input.soilHealthData,
        weatherPatterns: input.weatherPatterns,
        historicalYieldData: input.historicalYieldData,
        availableCrops: input.availableCrops,
    });

    // 2. Get Fertilizer Recommendation
    const fertilizerPlan = await getFertilizerRecommendation({
        cropType: input.cropType,
        soilTestResults: input.soilHealthData,
        farmLocation: input.farmLocation,
    });

    // 3. Get Irrigation Schedule
    const irrigationPlan = await getIrrigationSchedule({
        cropType: input.cropType,
        soilType: "Varies, see soil data.", // Acknowledge general nature
        plantingDate: format(new Date(), 'yyyy-MM-dd'), // Assume planting starts now
        farmLocation: input.farmLocation,
    });

    // 4. Get Yield Prediction
    const yieldPrediction = await getYieldPrediction({
        historicalYieldData: input.historicalYieldData,
        currentCropInfo: `Planning to plant ${input.cropType}. General health is good.`,
        weatherPatterns: input.weatherPatterns,
        soilHealthData: input.soilHealthData,
    });
    
    // 5. Generate Executive Summary using another AI call
    const summaryPrompt = `You are an expert agricultural consultant. Based on the following reports, create a high-level executive summary for a farmer. Synthesize the key takeaways from each section into a cohesive, easy-to-read overview.

    **Crop Plan:**
    - Recommended Crops: ${cropPlan.recommendedCrops}
    - Rotation Schedule: ${cropPlan.rotationSchedule}

    **Fertilizer Plan:**
    - NPK Recommendation: ${fertilizerPlan.npkRecommendation}
    - Application Strategy: ${fertilizerPlan.applicationStrategy}

    **Irrigation Plan:**
    - Next Irrigation: ${irrigationPlan.nextIrrigationDate}
    - Weekly Schedule: ${irrigationPlan.schedule}
    - Justification: ${irrigationPlan.justification}

    **Yield Prediction:**
    - Predicted Yield: ${yieldPrediction.predictedYield} (${yieldPrediction.confidenceLevel} confidence)
    - Influencing Factors: ${yieldPrediction.influencingFactors}

    Please generate the 'executiveSummary'.`;

    const { output } = await ai.generate({
        prompt: summaryPrompt,
        output: { schema: z.object({ executiveSummary: z.string() }) },
    });

    return {
      executiveSummary: output!.executiveSummary,
      cropPlan,
      fertilizerPlan,
      irrigationPlan,
      yieldPrediction,
    };
  }
);

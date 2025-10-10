'use server';
/**
 * @fileOverview A crop planning AI agent that provides recommendations for crop planning and rotation schedules based on farm data.
 *
 * - getCropPlan - A function that handles the crop planning process.
 * - CropPlanInput - The input type for the getCropPlan function.
 * - CropPlanOutput - The return type for the getCropPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropPlanInputSchema = z.object({
  farmLocation: z
    .string()
    .describe('The geographical location of the farm (e.g., latitude, longitude, or city/region).'),
  soilHealthData: z
    .string()
    .describe('Data on soil health, including NPK levels, pH analysis, and organic matter content.'),
  weatherPatterns: z
    .string()
    .describe('Historical weather patterns and forecasts for the farm location, including rainfall and temperature trends.'),
  historicalYieldData: z
    .string()
    .describe('Historical crop yield data for the farm over the past few seasons.'),
  availableCrops: z
    .string()
    .describe('A list of crops the farmer is considering or has available to plant.'),
});
export type CropPlanInput = z.infer<typeof CropPlanInputSchema>;

const CropPlanOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe('A list of the top recommended crops for the next planting season, with a brief justification for each.'),
  rotationSchedule: z
    .string()
... (38 lines left)
File too long. Skipping...
     * Show
     */
    'use server';

    import {Button} from '@/components/ui/button';
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from '@/components/ui/card';
    import Link from 'next/link';
    import {Bot} from 'lucide-react';

    export default function CropPlanningPage() {
      return (
        <div className="p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Bot className="text-primary" />
                AI Crop Planning Assistant
              </CardTitle>
              <CardDescription>
                Get a customized crop plan by providing details about your farm.
                The AI will analyze the data to provide optimal recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CropPlanningForm />
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

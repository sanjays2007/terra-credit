'use server';
/**
 * @fileOverview An AI assistant that recommends optimal irrigation schedules.
 *
 * This flow uses crop type, soil data, planting date, and simulated weather
 * to suggest when and how much to water, conserving water and improving crop health.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getWeather, WeatherData} from './flows/get-weather';

const IrrigationScheduleInputSchema = z.object({
  cropType: z.string().describe('The type of crop being cultivated (e.g., "Maize", "Tomatoes", "Almonds").'),
  soilType: z.string().describe('The soil composition of the field (e.g., "Sandy Loam", "Clay", "Silty Clay").'),
  plantingDate: z.string().describe('The date the crop was planted, in YYYY-MM-DD format.'),
  farmLocation: z.string().describe('The geographical location of the farm for weather forecasting.'),
});
export type IrrigationScheduleInput = z.infer<typeof IrrigationScheduleInputSchema>;

const IrrigationScheduleOutputSchema = z.object({
  nextIrrigationDate: z.string().describe('The recommended date for the next irrigation cycle (e.g., "YYYY-MM-DD").'),
  wateringDepthInches: z.number().describe('The recommended amount of water to apply, in inches.'),
  schedule: z.string().describe('A summary of the recommended irrigation schedule for the upcoming week (e.g., "2 times this week on Monday and Thursday").'),
  justification: z.string().describe('A detailed explanation for the recommendation, considering crop age, soil type, and the weather forecast.'),
});
export type IrrigationScheduleOutput = z.infer<typeof IrrigationScheduleOutputSchema>;

export async function getIrrigationSchedule(input: IrrigationScheduleInput): Promise<IrrigationScheduleOutput> {
  return irrigationSchedulingFlow(input);
}

const irrigationSchedulingFlow = ai.defineFlow(
  {
    name: 'irrigationSchedulingFlow',
    inputSchema: IrrigationScheduleInputSchema,
    outputSchema: IrrigationScheduleOutputSchema,
  },
  async (input) => {
    // In a real application, you might fetch a multi-day forecast.
    // Here, we use the simulated weather tool to get the current/today's weather.
    const weather = await getWeather(input.farmLocation);

    const weatherString = `Current weather is ${weather.condition} with a temperature of ${weather.temperature}°C, ${weather.humidity}% humidity, and a ${weather.precipitation}% chance of rain.`;

    const prompt = `You are an expert irrigation consultant AI. Your goal is to help farmers conserve water while maximizing crop health.

    Analyze the following information to create a smart irrigation recommendation.

    - Crop Type: ${input.cropType}
    - Soil Type: ${input.soilType}
    - Planting Date: ${input.plantingDate} (Today's date is ${new Date().toISOString().split('T')[0]})
    - Farm Location: ${input.farmLocation}
    - 7-Day Weather Forecast: ${weatherString}

    Based on the crop's current growth stage, the soil's water retention capacity, and the weather forecast, provide an optimal irrigation schedule.

    Please provide:
    1. 'nextIrrigationDate': The specific date for the next watering.
    2. 'wateringDepthInches': How many inches of water should be applied.
    3. 'schedule': A brief summary for the upcoming week.
    4. 'justification': A clear explanation for your recommendation, referencing the crop stage, soil, and weather.
    `;

    const { output } = await ai.generate({
        prompt,
        output: { schema: IrrigationScheduleOutputSchema },
    });
    
    return output!;
  }
);

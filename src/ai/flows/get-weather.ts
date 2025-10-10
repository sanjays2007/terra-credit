'use server';
/**
 * @fileOverview A flow to get simulated weather data for a given location.
 *
 * - getWeather - A function that returns simulated weather data.
 * - WeatherData - The return type for the getWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const WeatherDataSchema = z.object({
  location: z.string().describe('The location for which the weather is being reported.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., Sunny, Partly Cloudy, Light Rain).'),
  conditionIcon: z.enum(['Sun', 'Cloudy', 'CloudRain', 'Wind']).describe('An icon name representing the weather condition.'),
  humidity: z.number().describe('The current humidity as a percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  precipitation: z.number().describe('The percentage chance of precipitation.'),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;

// This function simulates fetching weather data. In a real application, this would
// make an API call to a weather service.
function getSimulatedWeather(location: string): WeatherData {
    const conditions = [
        { condition: 'Sunny', icon: 'Sun' },
        { condition: 'Partly Cloudy', icon: 'Cloudy' },
        { condition: 'Cloudy', icon: 'Cloudy' },
        { condition: 'Light Rain', icon: 'CloudRain' },
        { condition: 'Windy', icon: 'Wind' },
    ] as const;

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
        location: location,
        temperature: Math.floor(Math.random() * 15) + 20, // Temp between 20 and 35
        condition: randomCondition.condition,
        conditionIcon: randomCondition.icon,
        humidity: Math.floor(Math.random() * 40) + 50, // Humidity between 50 and 90
        windSpeed: Math.floor(Math.random() * 15) + 5, // Wind speed between 5 and 20
        precipitation: Math.floor(Math.random() * 100), // Precipitation chance
    };
}


const getWeatherTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Returns the current weather for a given location.',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: WeatherDataSchema,
  },
  async ({ location }) => {
    return getSimulatedWeather(location);
  }
);


const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: WeatherDataSchema,
  },
  async ({ location }) => {
    const weather = await getWeatherTool({ location });
    return weather;
  }
);

export async function getWeather(location: string): Promise<WeatherData> {
    return getWeatherFlow({ location });
}

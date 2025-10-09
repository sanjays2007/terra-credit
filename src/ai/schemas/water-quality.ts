import {z} from 'genkit';

// Define Zod schema for the input
export const WaterQualityInputSchema = z.object({
  ph: z.number().describe('The pH level of the water.'),
  oxygen: z.number().describe('The dissolved oxygen level in mg/L.'),
  temperature: z.number().describe('The water temperature in Celsius.'),
  turbidity: z.number().describe('The turbidity of the water in NTU.'),
  ammonia: z.number().describe('The ammonia level in ppm.'),
  nitrate: z.number().describe('The nitrate level in ppm.'),
  fishSpecies: z.string().describe('The species of fish in the pond (e.g., Tilapia, Catla, Rohu).'),
});
export type WaterQualityInput = z.infer<typeof WaterQualityInputSchema>;

// Define Zod schema for the output
export const WaterQualityOutputSchema = z.object({
  isOptimal: z.boolean().describe('Whether the current conditions are optimal for the specified fish species.'),
  analysis: z.string().describe('A detailed analysis of the provided water quality parameters.'),
  recommendations: z.string().describe('Actionable recommendations to improve or maintain water quality.'),
});
export type WaterQualityOutput = z.infer<typeof WaterQualityOutputSchema>;

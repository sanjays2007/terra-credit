
import {z} from 'genkit';

export const DiagnoseLivestockInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a farm animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the animal\'s symptoms or behavior.'),
});
export type DiagnoseLivestockInput = z.infer<typeof DiagnoseLivestockInputSchema>;

export const DiagnoseLivestockOutputSchema = z.object({
  assessment: z.object({
    healthStatus: z.enum(['Appears Healthy', 'Requires Monitoring', 'Veterinary Attention Recommended']).describe('A high-level assessment of the animal\'s health.'),
    potentialIssues: z.string().describe('A list of potential health issues identified from the visual and descriptive data.'),
  }),
  recommendation: z.string().describe("Actionable advice for the farmer, such as next steps for monitoring or when to contact a vet. This should be a preliminary recommendation, not a final diagnosis."),
});
export type DiagnoseLivestockOutput = z.infer<typeof DiagnoseLivestockOutputSchema>;

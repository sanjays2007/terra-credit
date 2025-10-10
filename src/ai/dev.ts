import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-advisory.ts';
import '@/ai/ai-water-quality.ts';
import '@/ai/ai-credit-scoring.ts';
import '@/ai/ai-forestry-analysis.ts';
import '@/ai/flows/get-weather.ts';
import '@/ai/flows/diagnose-plant-flow.ts';

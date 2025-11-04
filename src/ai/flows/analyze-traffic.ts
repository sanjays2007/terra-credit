'use server';
/**
 * @fileOverview A flow to analyze traffic from camera feed and provide insights.
 *
 * - analyzeTraffic - A function that returns traffic analysis data.
 * - TrafficAnalysisData - The return type for the analyzeTraffic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TrafficAnalysisDataSchema = z.object({
  people: z.number().describe('Number of pedestrians detected in the camera feed.'),
  twoWheelers: z.number().describe('Number of 2-wheelers (motorcycles, scooters) detected.'),
  fourWheelers: z.number().describe('Number of 4-wheelers (cars, trucks, buses) detected.'),
  violations: z.array(z.object({
    type: z.string().describe('Type of traffic violation detected.'),
    severity: z.enum(['low', 'medium', 'high']).describe('Severity level of the violation.'),
    description: z.string().describe('Description of the violation.'),
  })).describe('List of traffic violations detected.'),
  trafficDensity: z.enum(['low', 'medium', 'high', 'very_high']).describe('Overall traffic density level.'),
  recommendedSignalTiming: z.number().describe('Recommended signal timing in seconds based on traffic density.'),
  timestamp: z.string().describe('Timestamp of the analysis.'),
});

export type TrafficAnalysisData = z.infer<typeof TrafficAnalysisDataSchema>;

// This function simulates analyzing traffic from a camera feed.
// In a real application, this would process actual video frames using computer vision models.
function getSimulatedTrafficAnalysis(): TrafficAnalysisData {
  const people = Math.floor(Math.random() * 50);
  const twoWheelers = Math.floor(Math.random() * 30);
  const fourWheelers = Math.floor(Math.random() * 40);
  const totalVehicles = twoWheelers + fourWheelers;

  // Determine traffic density
  let trafficDensity: 'low' | 'medium' | 'high' | 'very_high';
  let recommendedSignalTiming: number;

  if (totalVehicles < 10) {
    trafficDensity = 'low';
    recommendedSignalTiming = 45;
  } else if (totalVehicles < 30) {
    trafficDensity = 'medium';
    recommendedSignalTiming = 60;
  } else if (totalVehicles < 50) {
    trafficDensity = 'high';
    recommendedSignalTiming = 75;
  } else {
    trafficDensity = 'very_high';
    recommendedSignalTiming = 90;
  }

  // Simulate violation detection
  const violationTypes = [
    { type: 'Red Light Violation', severity: 'high' as const, desc: 'Vehicle crossed intersection on red light' },
    { type: 'Speed Limit Exceeded', severity: 'medium' as const, desc: 'Vehicle exceeded speed limit by 20 km/h' },
    { type: 'Wrong Lane', severity: 'low' as const, desc: 'Vehicle in incorrect lane' },
    { type: 'No Helmet', severity: 'high' as const, desc: 'Two-wheeler rider without helmet' },
    { type: 'Illegal Parking', severity: 'low' as const, desc: 'Vehicle parked in no-parking zone' },
  ];

  const violations = [];
  const numViolations = Math.floor(Math.random() * 3); // 0-2 violations

  for (let i = 0; i < numViolations; i++) {
    const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    violations.push({
      type: violation.type,
      severity: violation.severity,
      description: violation.desc,
    });
  }

  return {
    people,
    twoWheelers,
    fourWheelers,
    violations,
    trafficDensity,
    recommendedSignalTiming,
    timestamp: new Date().toISOString(),
  };
}

const analyzeTrafficTool = ai.defineTool(
  {
    name: 'analyzeTraffic',
    description: 'Analyzes traffic from camera feed and detects people, vehicles, and violations.',
    inputSchema: z.object({ 
      cameraId: z.string().optional().describe('Optional camera identifier'),
    }),
    outputSchema: TrafficAnalysisDataSchema,
  },
  async () => {
    return getSimulatedTrafficAnalysis();
  }
);

const analyzeTrafficFlow = ai.defineFlow(
  {
    name: 'analyzeTrafficFlow',
    inputSchema: z.object({ 
      cameraId: z.string().optional().describe('Optional camera identifier'),
    }),
    outputSchema: TrafficAnalysisDataSchema,
  },
  async ({ cameraId }) => {
    const analysis = await analyzeTrafficTool({ cameraId });
    return analysis;
  }
);

export async function analyzeTraffic(cameraId?: string): Promise<TrafficAnalysisData> {
  return analyzeTrafficFlow({ cameraId });
}

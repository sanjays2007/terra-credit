
import { Bot, Lightbulb, Sprout, Bug, Droplets, Syringe, TrendingUp, FlaskConical, BarChart3, BrainCircuit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SummarizeAdvisoryForm } from './summarize-advisory-form';

const agricultureTools = [
  {
    title: 'Crop Planning Assistant',
    description: 'Get a customized crop plan by analyzing your farm\'s location, soil, and weather.',
    icon: Sprout,
    href: '/agriculture/crop-planning',
    buttonText: 'Plan Crops',
  },
  {
    title: 'Pest & Disease Detection',
    description: 'Upload a photo of a plant to identify it and diagnose any potential health issues.',
    icon: Bug,
    href: '/agriculture/pest-detection',
    buttonText: 'Analyze Plant',
  },
  {
    title: 'Smart Irrigation Scheduling',
    description: 'Get AI-powered irrigation schedules based on weather, crop type, and soil data.',
    icon: Droplets,
    href: '/agriculture/irrigation-scheduling',
    buttonText: 'Schedule Irrigation',
  },
  {
    title: 'Fertilizer Recommendation',
    description: 'Input soil test results to get optimal fertilizer blend and application recommendations.',
    icon: Syringe,
    href: '/agriculture/fertilizer-recommendation',
    buttonText: 'Get Recommendation',
  },
  {
    title: 'Harvest Yield Prediction',
    description: 'Forecast potential crop yields based on historical data, weather, and soil health.',
    icon: TrendingUp,
    href: '/agriculture/yield-prediction',
    buttonText: 'Predict Yield',
  },
  {
    title: 'Market Analysis',
    description: 'Analyze market prices and trends to determine the best time to sell your harvest.',
    icon: BarChart3,
    href: '/agriculture/market-analysis',
    buttonText: 'Analyze Market',
  },
  {
    title: 'A/B Testing Assistant',
    description: 'Design and analyze on-farm experiments to validate new techniques.',
    icon: FlaskConical,
    href: '/agriculture/ab-testing',
    buttonText: 'Design Experiment',
  },
];


export default function AgriculturePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <Card className="bg-gradient-to-br from-secondary/50 to-background">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <BrainCircuit className="text-primary w-8 h-8" />
            Integrated Farm Operations Advisor
          </CardTitle>
          <CardDescription>
            Your master AI co-pilot. Get a complete, unified operational plan for your crop season, orchestrating all the tools below into a single, actionable strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
              Start here to generate a comprehensive plan for your chosen crop, from planting to market.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg">
              <Link href="/agriculture/integrated-advisor">
                  Generate Integrated Plan
              </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agricultureTools.map((tool) => (
          <Card key={tool.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <tool.icon className="text-primary w-6 h-6" />
                {tool.title}
              </CardTitle>
              <CardDescription>
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               {/* This space can be used for a small insight or link if needed */}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href={tool.href}>
                        {tool.buttonText}
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI-Powered Advisory Summarizer
          </CardTitle>
          <CardDescription>
            Upload a PDF from your local extension office to get a summary of
            actionable recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SummarizeAdvisoryForm />
        </CardContent>
      </Card>

    </div>
  );
}

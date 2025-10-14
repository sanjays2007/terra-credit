
import { Bot, Lightbulb, Sprout, Bug, Droplets, Thermometer, Wind, CheckCircle, Search, List, Syringe, TrendingUp, Sun } from 'lucide-react';
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
    title: 'AI Crop Planning Assistant',
    description: 'Get a customized crop plan by analyzing your farm\'s location, soil, and weather.',
    icon: Sprout,
    href: '/agriculture/crop-planning',
    buttonText: 'Get Crop Plan',
  },
  {
    title: 'AI Pest & Disease Detection',
    description: 'Upload a photo of a plant to identify it and diagnose any potential health issues.',
    icon: Bug,
    href: '/agriculture/pest-detection',
    buttonText: 'Analyze Plant Photo',
  },
  {
    title: 'Smart Irrigation Scheduling',
    description: 'Get AI-powered irrigation schedules based on weather, crop type, and soil data.',
    icon: Droplets,
    href: '/agriculture/irrigation-scheduling',
    buttonText: 'Get Schedule',
  },
  {
    title: 'Fertilizer Recommendation Engine',
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
];


export default function AgriculturePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
               <p className="mb-4 text-sm text-muted-foreground">
                    Expand your agricultural intelligence with our specialized AI tools.
                </p>
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

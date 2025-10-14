
import { Bot, Lightbulb, Sprout, Bug } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SummarizeAdvisoryForm } from './summarize-advisory-form';

export default function AgriculturePage() {
  return (
    <div className="p-4 md:p-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Sprout className="text-primary" />
              AI Crop Planning Assistant
            </CardTitle>
            <CardDescription>
              Get a customized crop plan by providing details about your farm.
              The AI will analyze the data to provide optimal recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Our AI can analyze your farm's location, soil, and weather to recommend the best crops.
            </p>
            <Button asChild>
              <Link href="/agriculture/crop-planning">
                Get Crop Plan
              </Link>
            </Button>
          </CardContent>
        </Card>

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

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bug className="text-primary" />
              AI Pest & Disease Detection
            </CardTitle>
            <CardDescription>
              Upload a photo of a plant to identify it and diagnose any
              potential health issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Our AI can identify plants and check for signs of pests or
              diseases from a single image.
            </p>
            <Button asChild>
              <Link href="/agriculture/pest-detection">
                Analyze Plant Photo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

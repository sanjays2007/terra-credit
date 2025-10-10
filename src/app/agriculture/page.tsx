import { FileText, Lightbulb, Wheat, Sprout, Bug } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SummarizeAdvisoryForm from "./summarize-advisory-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function AgriculturePage() {
  return (
    <div className="p-4 md:p-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
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
          <CardContent>
            <Button asChild>
                <Link href="/agriculture/pest-detection">Analyze Plant Photo</Link>
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
            <CardTitle className="font-headline text-lg">
              AI Crop Planning
            </CardTitle>
            <CardDescription>
              Get AI recommendations for your next crop cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="mb-4 text-sm text-muted-foreground">
              Provide your farm's details to get a customized crop plan from our AI assistant.
            </p>
            <Button asChild>
              <Link href="/agriculture/crop-planning">Generate Crop Plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

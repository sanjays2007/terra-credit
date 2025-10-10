import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { PestDetectionForm } from "./pest-detection-form";
  import { Bot } from "lucide-react";
  
  export default function PestDetectionPage() {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bot className="text-primary" />
              AI Pest & Disease Detection
            </CardTitle>
            <CardDescription>
                Upload a photo of a plant to have the AI identify it and check for any signs of pests or diseases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PestDetectionForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  
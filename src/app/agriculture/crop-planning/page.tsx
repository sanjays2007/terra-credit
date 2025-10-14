
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CropPlanningForm } from "./crop-planning-form";
import { Bot } from "lucide-react";

export default function CropPlanningPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Crop Planning Assistant
          </CardTitle>
          <CardDescription>
            Get a customized crop plan by providing details about your farm.
            The AI will analyze the data to provide optimal recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CropPlanningForm />
        </CardContent>
      </Card>
    </div>
  );
}

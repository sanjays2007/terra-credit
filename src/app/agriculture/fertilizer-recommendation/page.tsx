
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FertilizerRecommendationForm } from "./fertilizer-recommendation-form";
import { Bot } from "lucide-react";

export default function FertilizerRecommendationPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Fertilizer Recommendation Engine
          </CardTitle>
          <CardDescription>
            Input your soil test results and crop type to receive an optimal fertilizer blend and application strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FertilizerRecommendationForm />
        </CardContent>
      </Card>
    </div>
  );
}

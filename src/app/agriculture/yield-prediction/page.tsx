
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YieldPredictionForm } from "./yield-prediction-form";
import { Bot } from "lucide-react";

export default function YieldPredictionPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Harvest Yield Prediction
          </CardTitle>
          <CardDescription>
            Forecast potential crop yields by providing historical data, weather patterns, and current crop information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <YieldPredictionForm />
        </CardContent>
      </Card>
    </div>
  );
}

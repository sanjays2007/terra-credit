
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IrrigationSchedulingForm } from "./irrigation-scheduling-form";
import { Bot } from "lucide-react";

export default function IrrigationSchedulingPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Smart Irrigation Scheduling
          </CardTitle>
          <CardDescription>
            Get a smart irrigation schedule based on your crop type, soil, planting date, and local weather forecasts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IrrigationSchedulingForm />
        </CardContent>
      </Card>
    </div>
  );
}

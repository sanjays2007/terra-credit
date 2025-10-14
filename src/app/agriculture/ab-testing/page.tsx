
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AbTestingForm } from "./ab-testing-form";
import { Bot } from "lucide-react";

export default function AbTestingPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI-Driven A/B Testing Assistant
          </CardTitle>
          <CardDescription>
            Design on-farm experiments and analyze the results to make data-driven decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AbTestingForm />
        </CardContent>
      </Card>
    </div>
  );
}

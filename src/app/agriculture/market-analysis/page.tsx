
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketAnalysisForm } from "./market-analysis-form";
import { Bot } from "lucide-react";

export default function MarketAnalysisPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI-Powered Market Analysis
          </CardTitle>
          <CardDescription>
            Get strategic insights into market prices, demand, and selling strategies for your crops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarketAnalysisForm />
        </CardContent>
      </Card>
    </div>
  );
}

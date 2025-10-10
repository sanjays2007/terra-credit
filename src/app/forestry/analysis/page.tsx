import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { ForestryAnalysisForm } from "./forestry-analysis-form";
  import { Bot } from "lucide-react";
  
  export default function ForestryAnalysisPage() {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bot className="text-primary" />
              AI Forestry Inventory Analysis
            </CardTitle>
            <CardDescription>
              Provide your tree inventory data to receive AI-powered analysis and
              recommendations for sustainable forest management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForestryAnalysisForm />
          </CardContent>
        </Card>
      </div>
    );
  }
  
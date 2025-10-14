
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntegratedAdvisorForm } from "./integrated-advisor-form";
import { Bot } from "lucide-react";

export default function IntegratedAdvisorPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Integrated Farm Operations Advisor
          </CardTitle>
          <CardDescription>
            Get a comprehensive, season-long operational plan for your chosen crop, synthesized from multiple AI analyses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IntegratedAdvisorForm />
        </CardContent>
      </Card>
    </div>
  );
}

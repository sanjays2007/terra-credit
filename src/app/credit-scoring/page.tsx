import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditScoreForm } from "./credit-scoring-form";
import { Landmark } from "lucide-react";

export default function CreditScoringPage() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Landmark className="text-primary" />
            AI-Powered Credit Scoring
          </CardTitle>
          <CardDescription>
            Generate a credit score by providing data about farm performance,
            finances, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreditScoreForm />
        </CardContent>
      </Card>
    </div>
  );
}

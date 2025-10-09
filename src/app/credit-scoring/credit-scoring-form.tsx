"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateCreditScore } from "@/ai/ai-credit-scoring";
import type { CreditScoreInput, CreditScoreOutput } from "@/ai/ai-credit-scoring";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, AlertCircle, Sparkles, TrendingUp, TrendingDown, Gauge } from "lucide-react";

const formSchema = z.object({
  farmPerformanceData: z.string().min(10, "Please provide more details."),
  satelliteImageryAnalysis: z.string().min(10, "Please provide more details."),
  financialData: z.string().min(10, "Please provide more details."),
  farmerProfile: z.string().min(10, "Please provide more details."),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisState = {
  result: CreditScoreOutput | null;
  error?: string;
};

export function CreditScoreForm() {
  const [state, setState] = useState<AnalysisState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmPerformanceData: "Consistent high yields in maize and soy for the past 5 years. Minor dip in 2022 due to drought.",
      satelliteImageryAnalysis: "NDVI shows healthy vegetation across 90% of the farm. Some water stress detected in the north-west quadrant.",
      financialData: "Annual revenue of $150,000. Low debt-to-income ratio. Consistent loan repayments on past equipment financing.",
      farmerProfile: "15 years of farming experience. Employs sustainable practices like crop rotation and no-till farming. Certified in modern agronomy.",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });

    try {
      const result = await generateCreditScore(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: "Failed to generate credit score. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-500';
    if (score >= 740) return 'text-green-400';
    if (score >= 670) return 'text-yellow-500';
    if (score >= 580) return 'text-orange-500';
    return 'text-red-500';
  };


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="farmPerformanceData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Performance Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Crop yields, livestock health..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satelliteImageryAnalysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satellite Imagery Analysis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., NDVI, vegetation indices..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="financialData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Income, expenses, debt..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="farmerProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farmer Profile</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Experience, education..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Credit Score
          </Button>
        </form>
      </Form>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card className="p-6 flex flex-col items-center justify-center text-center animate-pulse">
            <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="font-semibold">Analyzing data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Gauge />
                Credit Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Generated Credit Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(state.result.creditScore)}`}>
                    {state.result.creditScore}
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2 pb-2">
                        <TrendingDown className="w-5 h-5 text-destructive" />
                        <h4 className="font-semibold">Risk Factors</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose">{state.result.riskFactors}</p>
                    </CardContent>
                </Card>
                <Card className="bg-background">
                    <CardHeader className="flex-row items-center gap-2 pb-2">
                         <TrendingUp className="w-5 h-5 text-green-500" />
                        <h4 className="font-semibold">Recommendations</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose">{state.result.recommendations}</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

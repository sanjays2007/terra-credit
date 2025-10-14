
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getYieldPrediction, type YieldPredictionOutput } from '@/ai/ai-yield-prediction';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, TrendingUp, TrendingDown, CheckCircle, HelpCircle } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
    historicalYieldData: z.string().min(10, 'Please provide more historical yield details.'),
    currentCropInfo: z.string().min(10, 'Please provide more details on the current crop.'),
    weatherPatterns: z.string().min(10, 'Please describe the weather patterns for this season.'),
    soilHealthData: z.string().min(10, 'Please provide soil health data.'),
});

type FormValues = z.infer<typeof formSchema>;

type PredictionState = {
  result: YieldPredictionOutput | null;
  error?: string;
};

export function YieldPredictionForm() {
  const [state, setState] = useState<PredictionState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        historicalYieldData: "Last 3 years for Maize: 4.5 tons/ha (2023, good rain), 3.8 tons/ha (2022, mild drought), 4.2 tons/ha (2021).",
        currentCropInfo: "Maize, planted on June 15th. Currently in vegetative stage, looks healthy.",
        weatherPatterns: "Monsoon started on time, consistent rainfall so far. Forecast for the next month looks favorable.",
        soilHealthData: "pH: 6.8, Organic Matter: 1.2%, NPK levels are moderate to high after last fertilization.",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await getYieldPrediction(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate yield prediction. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (level: 'High' | 'Medium' | 'Low') => {
    switch(level) {
        case 'High': return 'text-green-500';
        case 'Medium': return 'text-yellow-500';
        case 'Low': return 'text-red-500';
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="historicalYieldData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Yield Data</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentCropInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Crop Information</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherPatterns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seasonal Weather Patterns</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="soilHealthData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Health Data</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
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
            Predict Yield
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
            <p className="font-semibold">AI is forecasting your harvest...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">AI Harvest Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 text-center bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Predicted Yield</p>
                    <p className="text-4xl font-bold text-primary">{state.result.predictedYield}</p>
                </Card>
                <Card className="p-6 text-center bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Confidence Level</p>
                    <p className={`text-4xl font-bold ${getConfidenceColor(state.result.confidenceLevel)}`}>
                        {state.result.confidenceLevel}
                    </p>
                </Card>
            </div>
            <Card>
                <CardHeader className="flex-row items-center gap-2 pb-2">
                    <HelpCircle className="w-5 h-5 text-muted-foreground"/>
                    <h4 className="font-semibold">Influencing Factors</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.influencingFactors}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex-row items-center gap-2 pb-2">
                    <TrendingUp className="w-5 h-5 text-green-500"/>
                    <h4 className="font-semibold">Recommendations for Improvement</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.recommendationsForImprovement}
                    </p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

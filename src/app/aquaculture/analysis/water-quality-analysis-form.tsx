
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeWaterQuality } from "@/ai/ai-water-quality";
import type { WaterQualityInput, WaterQualityOutput } from "@/ai/schemas/water-quality";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, AlertCircle, Sparkles, Droplets } from "lucide-react";

const formSchema = z.object({
  ph: z.coerce.number().min(0).max(14),
  oxygen: z.coerce.number().min(0),
  temperature: z.coerce.number(),
  turbidity: z.coerce.number().min(0),
  ammonia: z.coerce.number().min(0),
  nitrate: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisState = {
  result: WaterQualityOutput | null;
  error?: string;
};

export function WaterQualityAnalysisForm() {
  const [state, setState] = useState<AnalysisState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ph: 7.2,
      oxygen: 6.8,
      temperature: 26,
      turbidity: 12,
      ammonia: 0.1,
      nitrate: 0.5,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });

    try {
      const input: WaterQualityInput = {
        ...values,
        fishSpecies: "Rohu, Catla", // Example, could be another form field
      };
      const result = await analyzeWaterQuality(input);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: "Failed to generate analysis. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>pH Level</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oxygen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dissolved Oxygen (mg/L)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="turbidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turbidity (NTU)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ammonia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ammonia (ppm)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nitrate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nitrate (ppm)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
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
            Analyze Water Quality
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
            <p className="font-semibold">Analyzing parameters...</p>
            <p className="text-sm text-muted-foreground">Generating recommendations.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Droplets />
                Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert variant={state.result.isOptimal ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                    {state.result.isOptimal ? "Optimal Conditions" : "Action Required"}
                </AlertTitle>
                <AlertDescription>
                   {state.result.isOptimal
                    ? "The water quality parameters are within the optimal range for the specified fish species."
                    : "One or more parameters are outside the optimal range. See recommendations below."
                   }
                </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-semibold mb-2">Detailed Analysis</h4>
              <p className="text-sm text-muted-foreground prose">{state.result.analysis}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <p className="text-sm text-muted-foreground prose">{state.result.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

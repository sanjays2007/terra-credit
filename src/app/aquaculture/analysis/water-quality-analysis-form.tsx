
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
import { Loader, AlertCircle, Sparkles, Droplets, CheckCircle2, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  ph: z.coerce.number().min(0).max(14),
  oxygen: z.coerce.number().min(0),
  temperature: z.coerce.number(),
  turbidity: z.coerce.number().min(0),
  ammonia: z.coerce.number().min(0),
  nitrate: z.coerce.number().min(0),
  fishSpecies: z.string().min(3, "Please specify fish species."),
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
      temperature: 28,
      turbidity: 12,
      ammonia: 0.1,
      nitrate: 5,
      fishSpecies: "Rohu, Catla",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });

    try {
      const result = await analyzeWaterQuality(values);
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
          <FormField
              control={form.control}
              name="fishSpecies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fish Species</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tilapia, Catla" {...field} />
                  </FormControl>
                  <FormDescription>
                    The species in the pond being analyzed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    <Input type="number" step="1" {...field} />
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
             <Alert variant={state.result.isOptimal ? "default" : "destructive"} className={state.result.isOptimal ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800" : ""}>
                {state.result.isOptimal ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertTitle className={state.result.isOptimal ? "text-green-800 dark:text-green-200" : ""}>
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
              <div className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.analysis}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <div className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.recommendations}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

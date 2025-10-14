
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCropPlan, type CropPlanInput, type CropPlanOutput } from '@/ai/ai-crop-planning';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, Check, List } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
    farmLocation: z.string().min(3, 'Please provide a valid location.'),
    soilHealthData: z.string().min(10, 'Please provide more soil health details.'),
    weatherPatterns: z.string().min(10, 'Please describe weather patterns.'),
    historicalYieldData: z.string().min(10, 'Please provide historical yield data.'),
    availableCrops: z.string().min(3, 'Please list some available crops.'),
});

type FormValues = z.infer<typeof formSchema>;

type PlanState = {
  result: CropPlanOutput | null;
  error?: string;
};

export function CropPlanningForm() {
  const [state, setState] = useState<PlanState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        farmLocation: "Anand, Gujarat, India",
        soilHealthData: "Soil is mostly sandy loam. pH is 6.8. Organic matter is around 1.2%. NPK levels are moderate.",
        weatherPatterns: "Hot summers with monsoon season from June to September. Average rainfall is 800mm. Mild winters.",
        historicalYieldData: "Last 3 years: Maize (4-5 tons/ha), Wheat (3-4 tons/ha), Cotton (1.5-2 tons/ha).",
        availableCrops: "Maize, Wheat, Cotton, Sorghum, Pearl Millet, various vegetables.",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await getCropPlan(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate crop plan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="farmLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Location</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
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
                    <Textarea {...field} rows={2} />
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
                  <FormLabel>Weather Patterns</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="historicalYieldData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Yield Data</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableCrops"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available/Considered Crops</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
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
            Generate Crop Plan
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
            <p className="font-semibold">AI is generating your crop plan...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">AI-Generated Crop Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Check className="w-5 h-5 text-green-500"/>
                    <h4 className="font-semibold">Recommended Crops</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.recommendedCrops}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <List className="w-5 h-5 text-primary"/>
                    <h4 className="font-semibold">Rotation Schedule</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.rotationSchedule}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <h4 className="font-semibold">Justification</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.justification}
                    </p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

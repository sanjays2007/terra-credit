
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getIntegratedPlan, type IntegratedAdvisorInput, type IntegratedAdvisorOutput } from '@/ai/ai-integrated-advisor';
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
import { Loader, AlertCircle, Sparkles, BrainCircuit, Sprout, Syringe, Droplets, TrendingUp } from 'lucide-react';
import { z } from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
    cropType: z.string().min(3, 'Please enter a crop type.'),
    farmLocation: z.string().min(3, 'Please provide a valid location.'),
    soilHealthData: z.string().min(10, 'Please provide more soil health details.'),
    weatherPatterns: z.string().min(10, 'Please describe weather patterns.'),
    historicalYieldData: z.string().min(10, 'Please provide historical yield data.'),
    availableCrops: z.string().min(3, 'Please list some available crops for rotation.'),
});

type FormValues = z.infer<typeof formSchema>;

type PlanState = {
  result: IntegratedAdvisorOutput | null;
  error?: string;
};

export function IntegratedAdvisorForm() {
  const [state, setState] = useState<PlanState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        cropType: "Maize",
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
      const result = await getIntegratedPlan(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate integrated plan. Please try again.',
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
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Crop for this Season</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Available/Considered Crops for Rotation</FormLabel>
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
            Generate Integrated Plan
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
            <p className="font-semibold">AI is generating your integrated plan...</p>
            <p className="text-sm text-muted-foreground">This is orchestrating multiple AI tools and may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <BrainCircuit className="text-primary"/>
                AI Integrated Operations Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-md">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.executiveSummary}
                    </p>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger><div className="flex items-center gap-2"><Sprout /> Crop Plan</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p><strong>Recommended Crops:</strong> {state.result.cropPlan.recommendedCrops}</p>
                  <p><strong>Rotation Schedule:</strong> {state.result.cropPlan.rotationSchedule}</p>
                  <p><strong>Justification:</strong> {state.result.cropPlan.justification}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger><div className="flex items-center gap-2"><Syringe /> Fertilizer Plan</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p><strong>NPK Recommendation:</strong> {state.result.fertilizerPlan.npkRecommendation}</p>
                  <p><strong>Application Strategy:</strong> {state.result.fertilizerPlan.applicationStrategy}</p>
                  <p><strong>Micronutrient Needs:</strong> {state.result.fertilizerPlan.micronutrientNeeds}</p>
                  <p><strong>Justification:</strong> {state.result.fertilizerPlan.justification}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger><div className="flex items-center gap-2"><Droplets /> Irrigation Schedule</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p><strong>Next Irrigation:</strong> {state.result.irrigationPlan.nextIrrigationDate}</p>
                  <p><strong>Watering Depth:</strong> {state.result.irrigationPlan.wateringDepthInches} inches</p>
                  <p><strong>Weekly Schedule:</strong> {state.result.irrigationPlan.schedule}</p>
                  <p><strong>Justification:</strong> {state.result.irrigationPlan.justification}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger><div className="flex items-center gap-2"><TrendingUp /> Yield Prediction</div></AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p><strong>Predicted Yield:</strong> {state.result.yieldPrediction.predictedYield}</p>
                  <p><strong>Confidence Level:</strong> {state.result.yieldPrediction.confidenceLevel}</p>
                  <p><strong>Influencing Factors:</strong> {state.result.yieldPrediction.influencingFactors}</p>
                  <p><strong>Recommendations:</strong> {state.result.yieldPrediction.recommendationsForImprovement}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

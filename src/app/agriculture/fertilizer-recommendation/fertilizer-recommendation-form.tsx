
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFertilizerRecommendation, type FertilizerRecommendationOutput } from '@/ai/ai-fertilizer-recommendation';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, Syringe, TestTube2, Check } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
    cropType: z.string().min(3, 'Please provide a valid crop type.'),
    soilTestResults: z.string().min(10, 'Please provide detailed soil test results.'),
    farmLocation: z.string().min(3, 'Please provide a farm location.'),
});

type FormValues = z.infer<typeof formSchema>;

type RecState = {
  result: FertilizerRecommendationOutput | null;
  error?: string;
};

export function FertilizerRecommendationForm() {
  const [state, setState] = useState<RecState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        cropType: "Maize (Corn)",
        soilTestResults: "pH: 6.5, Organic Matter: 1.5%, Nitrogen (N): 25 ppm, Phosphorus (P): 40 ppm, Potassium (K): 150 ppm.",
        farmLocation: "Anand, Gujarat, India",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await getFertilizerRecommendation(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate fertilizer recommendation. Please try again.',
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
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="farmLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <FormField
              control={form.control}
              name="soilTestResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Test Results</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Recommendation
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
            <p className="font-semibold">AI is analyzing your soil data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">AI Fertilizer Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <TestTube2 className="w-5 h-5 text-primary"/>
                        <h4 className="font-semibold">NPK Recommendation</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-primary">{state.result.npkRecommendation}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Syringe className="w-5 h-5 text-green-500"/>
                        <h4 className="font-semibold">Micronutrient Needs</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                            {state.result.micronutrientNeeds}
                        </p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Check className="w-5 h-5 text-green-500"/>
                    <h4 className="font-semibold">Application Strategy</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.applicationStrategy}
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

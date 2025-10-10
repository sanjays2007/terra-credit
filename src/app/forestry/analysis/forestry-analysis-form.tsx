
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeForestryInventory } from '@/ai/ai-forestry-analysis';
import type { ForestryAnalysisOutput } from '@/ai/ai-forestry-analysis';
import { forestryData } from '@/lib/data';
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
import { Loader, AlertCircle, Sparkles, Trees, Leaf } from 'lucide-react';

const formSchema = z.object({
  inventoryData: z.string().min(20, 'Please provide more inventory data.'),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisState = {
  result: ForestryAnalysisOutput | null;
  error?: string;
};

export function ForestryAnalysisForm() {
  const [state, setState] = useState<AnalysisState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inventoryData: JSON.stringify(forestryData, null, 2),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });

    try {
      // Basic check for valid JSON
      JSON.parse(values.inventoryData);
      const result = await analyzeForestryInventory({ inventoryData: values.inventoryData });
      setState({ result });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof SyntaxError 
        ? "Invalid JSON format. Please check your data."
        : "Failed to generate analysis. Please try again.";
      setState({
        result: null,
        error: errorMessage,
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
            name="inventoryData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tree Inventory Data (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your tree inventory as a JSON array..."
                    {...field}
                    rows={12}
                  />
                </FormControl>
                <FormDescription>
                  Provide an array of tree objects. Each object should contain details like species, location, biomass, etc.
                </FormDescription>
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
            Analyze Inventory
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
          <p className="font-semibold">Analyzing inventory...</p>
          <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Trees />
              Forestry Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background">
                <CardHeader className="flex-row items-center gap-2 pb-2">
                  <h4 className="font-semibold">Analysis</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground prose dark:prose-invert">
                    {state.result.analysis}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader className="flex-row items-center gap-2 pb-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold">Recommendations</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground prose dark:prose-invert">
                    {state.result.recommendations}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

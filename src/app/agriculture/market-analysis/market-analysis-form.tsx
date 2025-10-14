
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMarketAnalysis, type MarketAnalysisInput, type MarketAnalysisOutput } from '@/ai/ai-market-analysis';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, BarChart3, TrendingUp, Lightbulb, Factory } from 'lucide-react';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    cropType: z.string().min(3, 'Please enter a crop type.'),
    harvestMonth: z.string().min(3, 'Please select a harvest month.'),
    region: z.string().min(3, 'Please provide a market region.'),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisState = {
  result: MarketAnalysisOutput | null;
  error?: string;
};

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


export function MarketAnalysisForm() {
  const [state, setState] = useState<AnalysisState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        cropType: "Cotton",
        harvestMonth: "October",
        region: "Gujarat, India",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await getMarketAnalysis(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate market analysis. Please try again.',
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
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="harvestMonth"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Harvest Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a month" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gujarat, India" {...field} />
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
            Analyze Market
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
            <p className="font-semibold">AI is analyzing market data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2"><BarChart3/> Market Analysis Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Lightbulb className="w-5 h-5 text-primary"/>
                    <h4 className="font-semibold">Selling Recommendation</h4>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                        {state.result.sellingRecommendation}
                    </p>
                </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <TrendingUp className="w-5 h-5 text-green-500"/>
                        <h4 className="font-semibold">Price Trends</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                            {state.result.priceTrendAnalysis}
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Factory className="w-5 h-5 text-muted-foreground"/>
                        <h4 className="font-semibold">Demand Forecast</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                            {state.result.demandForecast}
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <h4 className="font-semibold">Key Influencing Factors</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                            {state.result.keyFactors}
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

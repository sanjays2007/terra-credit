
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeSatelliteImagery, type ForestrySatelliteOutput } from '@/ai/ai-forestry-satellite-analysis';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, ShieldAlert, ShieldCheck, ShieldQuestion, Search, Lightbulb } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const formSchema = z.object({
    sector: z.string().min(2, 'Please specify a sector.'),
    vegetationDescription: z.string().min(10, 'Please provide a more detailed description.'),
    simulatedNdvi: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= -1 && parseFloat(val) <= 1, {
        message: "NDVI must be a number between -1 and 1."
    }),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisState = {
  result: ForestrySatelliteOutput | null;
  error?: string;
};

export function SatelliteAnalysisForm() {
  const [state, setState] = useState<AnalysisState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sector: 'Sector 4D',
      vegetationDescription: 'Ground teams report some visible browning and thinning of the canopy compared to last quarter.',
      simulatedNdvi: '0.35',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await analyzeSatelliteImagery(values);
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate analysis. The AI model may be unavailable.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (status: ForestrySatelliteOutput['healthAssessment']) => {
    switch (status) {
      case 'Healthy':
        return { icon: ShieldCheck, color: 'text-green-500', label: 'Healthy' };
      case 'Moderate Stress':
        return { icon: ShieldAlert, color: 'text-yellow-500', label: 'Moderate Stress' };
      case 'Severe Stress':
        return { icon: ShieldAlert, color: 'text-red-500', label: 'Severe Stress' };
      case 'Potential Disease':
        return { icon: ShieldQuestion, color: 'text-purple-500', label: 'Potential Disease' };
      default:
        return { icon: ShieldQuestion, color: 'text-muted-foreground', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="sector" render={({ field }) => ( <FormItem><FormLabel>Forestry Sector</FormLabel><FormControl><Input placeholder="e.g., Sector 4D" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="simulatedNdvi" render={({ field }) => ( <FormItem><FormLabel>Simulated NDVI Value</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 0.7" {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
          <FormField control={form.control} name="vegetationDescription" render={({ field }) => ( <FormItem><FormLabel>Ground Observations</FormLabel><FormControl><Textarea placeholder="Describe the appearance of the vegetation..." {...field} rows={4}/></FormControl><FormDescription>Provide any notes from ground teams about the sector's condition.</FormDescription><FormMessage /></FormItem> )}/>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze Sector Health
          </Button>
        </form>
      </Form>

      {state.error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      
      {loading && (
        <Card className="p-6 flex flex-col items-center justify-center text-center animate-pulse">
          <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="font-semibold">AI is analyzing remote sensing data...</p>
          <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (() => {
        const healthStatus = getHealthStatus(state.result.healthAssessment);
        const HealthIcon = healthStatus.icon;

        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">Remote Sensing Analysis Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`text-center p-6 rounded-lg bg-secondary/50`}>
                <p className="text-sm text-muted-foreground">AI Health Assessment</p>
                <div className={`flex items-center justify-center gap-2 text-4xl font-bold ${healthStatus.color}`}>
                  <HealthIcon className="w-8 h-8" />
                  <span>{healthStatus.label}</span>
                </div>
              </div>
              <Card>
                <CardHeader className="flex-row items-center gap-2 pb-2">
                    <h4 className="font-semibold">Analysis Summary</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.analysisSummary}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-background">
                  <CardHeader className="flex-row items-center gap-2 pb-2">
                    <Search className="w-5 h-5 text-destructive" />
                    <h4 className="font-semibold">Potential Issues Identified</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.potentialIssues}</p>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardHeader className="flex-row items-center gap-2 pb-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Recommended Actions</h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.recommendations}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}

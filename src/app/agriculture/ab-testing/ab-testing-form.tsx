
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { designAbTest, analyzeAbTest, type ABTestDesignOutput, type ABTestAnalysisOutput } from '@/ai/ai-ab-testing';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, FlaskConical, Beaker, ClipboardList, BookCheck, Info } from 'lucide-react';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schemas for the two forms
const designFormSchema = z.object({
  objective: z.string().min(10, 'Please describe your objective in more detail.'),
  crop: z.string().min(3, 'Please enter a crop.'),
  metrics: z.string().min(5, 'Please list at least one metric.'),
  farmSize: z.string().min(3, 'Please specify the available area.'),
});
type DesignFormValues = z.infer<typeof designFormSchema>;

const analysisFormSchema = z.object({
  originalObjective: z.string().min(10, 'Please describe the original objective.'),
  controlGroupResults: z.string().min(10, 'Please describe the results from the control group.'),
  variableGroupResults: z.string().min(10, 'Please describe the results from the test group.'),
});
type AnalysisFormValues = z.infer<typeof analysisFormSchema>;


type FormState = {
  designResult: ABTestDesignOutput | null;
  analysisResult: ABTestAnalysisOutput | null;
  error?: string;
};

export function AbTestingForm() {
  const [state, setState] = useState<FormState>({ designResult: null, analysisResult: null });
  const [loading, setLoading] = useState(false);

  const designForm = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
        objective: "Test a new bio-stimulant against standard practice to see if it increases yield.",
        crop: "Tomato",
        metrics: "Total yield (in kg), average fruit size, number of pest incidents.",
        farmSize: "Two adjacent 1-acre plots are available.",
    },
  });

  const analysisForm = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
        originalObjective: "Test a new bio-stimulant against standard practice for tomato yield.",
        controlGroupResults: "Group A (Control): Yield was 4,500 kg. Average fruit size was 150g. Two minor pest incidents reported.",
        variableGroupResults: "Group B (Bio-stimulant): Yield was 4,950 kg (a 10% increase). Average fruit size was 160g. No pest incidents reported.",
    },
  });

  const onDesignSubmit = async (values: DesignFormValues) => {
    setLoading(true);
    setState({ designResult: null, analysisResult: null, error: undefined });
    try {
      const result = await designAbTest(values);
      setState({ designResult: result, analysisResult: null });
    } catch (e) {
        setState({ designResult: null, analysisResult: null, error: 'Failed to generate design.' });
    } finally {
      setLoading(false);
    }
  };
  
  const onAnalysisSubmit = async (values: AnalysisFormValues) => {
    setLoading(true);
    setState({ designResult: null, analysisResult: null, error: undefined });
    try {
      const result = await analyzeAbTest(values);
      setState({ designResult: null, analysisResult: result });
    } catch (e) {
        setState({ designResult: null, analysisResult: null, error: 'Failed to generate analysis.' });
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
        <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="design">1. Design Experiment</TabsTrigger>
                <TabsTrigger value="analysis">2. Analyze Results</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Beaker/> Design Your Experiment</CardTitle>
                        <CardDescription>Define your experiment's goal, and the AI will create a practical plan for you to follow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...designForm}>
                            <form onSubmit={designForm.handleSubmit(onDesignSubmit)} className="space-y-4">
                                <FormField control={designForm.control} name="objective" render={({ field }) => (<FormItem><FormLabel>Objective</FormLabel><FormControl><Textarea placeholder="e.g., Test a new fertilizer..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField control={designForm.control} name="crop" render={({ field }) => (<FormItem><FormLabel>Crop</FormLabel><FormControl><Input placeholder="e.g., Wheat" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={designForm.control} name="metrics" render={({ field }) => (<FormItem><FormLabel>Success Metrics</FormLabel><FormControl><Input placeholder="e.g., Yield (kg/acre)" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={designForm.control} name="farmSize" render={({ field }) => (<FormItem><FormLabel>Available Area</FormLabel><FormControl><Input placeholder="e.g., Two 1-acre plots" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Design
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="analysis">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookCheck/> Analyze Your Results</CardTitle>
                        <CardDescription>Input the results from your control and test groups to get an AI-powered conclusion.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...analysisForm}>
                            <form onSubmit={analysisForm.handleSubmit(onAnalysisSubmit)} className="space-y-4">
                                <FormField control={analysisForm.control} name="originalObjective" render={({ field }) => (<FormItem><FormLabel>Original Objective</FormLabel><FormControl><Textarea placeholder="What was the goal of the test?" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={analysisForm.control} name="controlGroupResults" render={({ field }) => (<FormItem><FormLabel>Control Group (A) Results</FormLabel><FormControl><Textarea placeholder="Describe the outcomes for the standard practice group..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={analysisForm.control} name="variableGroupResults" render={({ field }) => (<FormItem><FormLabel>Test Group (B) Results</FormLabel><FormControl><Textarea placeholder="Describe the outcomes for the group with the new variable..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)}/>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Get Analysis
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {state.error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
        
        {loading && (
            <Card className="p-6 flex flex-col items-center justify-center text-center animate-pulse">
                <Loader className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="font-semibold">AI is thinking...</p>
                <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </Card>
        )}

        {state.designResult && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2"><FlaskConical/> AI-Generated Experimental Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2"><ClipboardList className="w-5 h-5 text-primary"/><h4 className="font-semibold">Step-by-Step Plan</h4></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.designResult.experimentalDesign}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2"><Info className="w-5 h-5 text-yellow-500"/><h4 className="font-semibold">Potential Biases to Consider</h4></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.designResult.potentialBiases}</p></CardContent>
                    </Card>
                </CardContent>
            </Card>
        )}

        {state.analysisResult && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2"><BookCheck/> AI-Generated Test Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="text-center p-6 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground">AI Confidence in Conclusion</p>
                        <p className={`text-4xl font-bold ${getConfidenceColor(state.analysisResult.confidence)}`}>
                            {state.analysisResult.confidence}
                        </p>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2"><h4 className="font-semibold">Conclusion</h4></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.analysisResult.conclusion}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2 pb-2"><Lightbulb className="w-5 h-5 text-primary"/><h4 className="font-semibold">Recommendation</h4></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.analysisResult.recommendation}</p></CardContent>
                    </Card>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

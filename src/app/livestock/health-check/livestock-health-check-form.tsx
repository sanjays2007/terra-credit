
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { diagnoseLivestock } from '@/ai/flows/diagnose-livestock-flow';
import type { DiagnoseLivestockOutput } from '@/ai/schemas/livestock-diagnosis';
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
import { Loader, AlertCircle, Sparkles, HeartPulse, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  animalImage: z.any().refine(fileList => fileList.length > 0, 'An image of the animal is required.'),
  description: z.string().min(10, 'Please provide a more detailed description of the animal\'s behavior or symptoms.'),
});

type FormValues = z.infer<typeof formSchema>;

type DiagnosisState = {
  result: DiagnoseLivestockOutput | null;
  error?: string;
};

export function LivestockHealthCheckForm() {
  const [state, setState] = useState<DiagnosisState>({ result: null });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: 'This cow seems lethargic today and is not eating as much as usual. Its coat appears a bit dull.',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file (e.g., JPG, PNG, WEBP).',
        });
        form.setValue('animalImage', null);
        setPreviewUrl(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });

    const file = values.animalImage[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await diagnoseLivestock({ photoDataUri, description: values.description });
            setState({ result });
        } catch (error) {
            console.error(error);
            setState({
            result: null,
            error: 'Failed to generate diagnosis. The AI model may be unavailable.',
            });
        } finally {
            setLoading(false);
        }
    }
    reader.onerror = () => {
        setState({ result: null, error: "Failed to read the image file."});
        setLoading(false);
    }
  };

  const getHealthStatus = (status: DiagnoseLivestockOutput['assessment']['healthStatus']) => {
    switch (status) {
      case 'Appears Healthy':
        return { icon: ShieldCheck, color: 'text-green-500', label: 'Appears Healthy' };
      case 'Requires Monitoring':
        return { icon: ShieldAlert, color: 'text-yellow-500', label: 'Requires Monitoring' };
      case 'Veterinary Attention Recommended':
        return { icon: ShieldQuestion, color: 'text-red-500', label: 'Vet Attention Recommended' };
      default:
        return { icon: ShieldQuestion, color: 'text-muted-foreground', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="animalImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Animal Image</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleFileChange(e);
                            }}
                        />
                    </FormControl>
                    <FormDescription>
                        Upload a clear image of the animal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {previewUrl && (
                <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Image Preview</p>
                    <Image
                        src={previewUrl}
                        alt="Animal preview"
                        width={200}
                        height={200}
                        className="rounded-md object-cover aspect-square"
                    />
                </div>
               )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Symptoms/Behavior</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Lethargic, not eating, unusual gait..."
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                   <FormDescription>
                        Describe any unusual signs in as much detail as possible.
                    </FormDescription>
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
            Assess Animal Health
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
          <p className="font-semibold">AI is analyzing the animal's condition...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments.</p>
        </Card>
      )}

      {state.result && (() => {
        const healthStatus = getHealthStatus(state.result.assessment.healthStatus);
        const HealthIcon = healthStatus.icon;

        return (
            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                <HeartPulse />
                AI Health Assessment Report
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className={`text-center p-6 rounded-lg bg-secondary/50`}>
                    <p className="text-sm text-muted-foreground">Preliminary Assessment</p>
                    <div className={`flex items-center justify-center gap-2 text-3xl font-bold ${healthStatus.color}`}>
                        <HealthIcon className="w-7 h-7" />
                        <span>{healthStatus.label}</span>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-semibold">Potential Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.assessment.potentialIssues}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-semibold">Recommended Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">{state.result.recommendation}</p>
                        <Alert variant="default" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription>
                                This is an AI-generated preliminary assessment and not a substitute for professional veterinary advice.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </CardContent>
            </Card>
        );
      })()}
    </div>
  );
}


'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { DiagnosePlantOutput } from '@/ai/schemas/plant-diagnosis';
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
import { Loader, AlertCircle, Sparkles, CheckCircle, XCircle, Leaf, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  plantImage: z.any().refine(fileList => fileList.length > 0, 'A plant image is required.'),
  description: z.string().min(10, 'Please provide a more detailed description.'),
});

type FormValues = z.infer<typeof formSchema>;

type DiagnosisState = {
  result: DiagnosePlantOutput | null;
  error?: string;
};

export function PlantDiagnosisForm() {
  const [state, setState] = useState<DiagnosisState>({ result: null });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: 'The leaves on my tomato plant are turning yellow and have brown spots. The plant seems to be wilting despite regular watering.',
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
        form.setValue('plantImage', null);
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

    const file = values.plantImage[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await diagnosePlant({ photoDataUri, description: values.description });
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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="plantImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant Image</FormLabel>
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
                        Upload a clear image of the affected plant.
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
                        alt="Plant preview"
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
                  <FormLabel>Description of Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Yellowing leaves, brown spots, wilting..."
                      {...field}
                      rows={8}
                    />
                  </FormControl>
                   <FormDescription>
                        Describe the problem in as much detail as possible.
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
            Diagnose Plant
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
          <p className="font-semibold">AI is analyzing your plant...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Leaf />
              Diagnosis Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-md flex items-center gap-2">
                        <Search />
                        Identification
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Common Name:</strong> {state.result.identification.commonName}</p>
                    <p><strong>Latin Name:</strong> <em>{state.result.identification.latinName}</em></p>
                </CardContent>
            </Card>

            <Alert variant={state.result.diagnosis.isHealthy ? 'default' : 'destructive'}>
                {state.result.diagnosis.isHealthy ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>
                    {state.result.diagnosis.isHealthy ? 'Plant appears healthy' : 'Potential issue detected'}
                </AlertTitle>
            </Alert>
            
            <div>
              <h4 className="font-semibold mb-2">Detailed Diagnosis</h4>
              <div className="text-sm text-muted-foreground prose dark:prose-invert max-w-none">
                {state.result.diagnosis.diagnosis}
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}

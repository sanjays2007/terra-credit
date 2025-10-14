
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getIrrigationSchedule, type IrrigationScheduleOutput } from '@/ai/ai-irrigation-scheduling';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle, Sparkles, Droplets, CalendarDays, BarChart } from 'lucide-react';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
    cropType: z.string().min(3, 'Please provide a valid crop type.'),
    soilType: z.string().min(3, 'Please provide a valid soil type.'),
    plantingDate: z.date({
        required_error: 'A planting date is required.',
    }),
    farmLocation: z.string().min(3, 'Please provide a location for weather forecasting.'),
});

type FormValues = z.infer<typeof formSchema>;

type ScheduleState = {
  result: IrrigationScheduleOutput | null;
  error?: string;
};

export function IrrigationSchedulingForm() {
  const [state, setState] = useState<ScheduleState>({ result: null });
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        cropType: "Tomato",
        soilType: "Sandy Loam",
        farmLocation: "Anand, Gujarat, India",
        plantingDate: new Date(new Date().setMonth(new Date().getMonth() - 2)), // Default to 2 months ago
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setState({ result: null, error: undefined });
    try {
      const result = await getIrrigationSchedule({
        ...values,
        plantingDate: format(values.plantingDate, 'yyyy-MM-dd'),
      });
      setState({ result });
    } catch (error) {
      console.error(error);
      setState({
        result: null,
        error: 'Failed to generate irrigation schedule. Please try again.',
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
                    <Input placeholder="e.g., Maize, Tomato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sandy Loam, Clay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Planting Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
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
                    <Input placeholder="e.g., Anand, Gujarat, India" {...field} />
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
            Get Irrigation Schedule
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
            <p className="font-semibold">AI is analyzing weather and crop data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment.</p>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">AI-Generated Irrigation Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <CalendarDays className="w-5 h-5 text-primary"/>
                        <h4 className="font-semibold">Next Irrigation</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-primary">{format(new Date(state.result.nextIrrigationDate), 'MMM dd, yyyy')}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Droplets className="w-5 h-5 text-blue-500"/>
                        <h4 className="font-semibold">Watering Amount</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-blue-500">{state.result.wateringDepthInches} inches</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <BarChart className="w-5 h-5 text-muted-foreground"/>
                        <h4 className="font-semibold">Weekly Schedule</h4>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-semibold">{state.result.schedule}</p>
                    </CardContent>
                </Card>
            </div>
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

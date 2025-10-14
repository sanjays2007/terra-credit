
'use client';

import { useState } from 'react';
import type { Livestock } from '@/lib/types';
import { getFeedRecommendation, type FeedRecommendationOutput } from '@/ai/ai-livestock-feed';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, AlertCircle } from 'lucide-react';
import { differenceInYears } from 'date-fns';

interface FeedPlanDialogProps {
  animal: Livestock;
  children: React.ReactNode;
}

export function FeedPlanDialog({ animal, children }: FeedPlanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<FeedRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !result) {
      // Trigger AI flow when dialog opens
      setLoading(true);
      setError(null);
      try {
        const age = differenceInYears(new Date(), new Date(animal.birthDate));
        const recommendation = await getFeedRecommendation({
          breed: animal.breed,
          age: age,
          weight: 700, // Placeholder weight
          healthStatus: animal.healthStatus,
          productionGoal: animal.productionRate.includes('L/day') ? 'Lactation' : 'Maintenance',
        });
        setResult(recommendation);
      } catch (e) {
        console.error(e);
        setError('Failed to generate feed recommendation. The AI model may be unavailable.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Feed Plan for {animal.id}</DialogTitle>
          <DialogDescription>
            An optimized feeding recommendation for a {animal.breed}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading && (
            <div className="flex items-center justify-center space-x-2 animate-pulse">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Generating recommendation...</span>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-4">
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-md font-semibold'>Daily Ration Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-2xl font-bold text-primary">{result.totalDailyIntake}</p>
                    </CardContent>
                </Card>
               <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-md font-semibold'>Feed Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm prose-sm text-muted-foreground max-w-none">{result.feedComposition}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-md font-semibold'>Justification</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm prose-sm text-muted-foreground max-w-none">{result.justification}</p>
                    </CardContent>
                </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

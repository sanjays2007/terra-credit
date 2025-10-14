
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { initialLivestockData } from '@/lib/data';
import type { Livestock } from '@/lib/types';
import { PlusCircle, Droplet, HeartPulse, Activity, Bot, Camera } from 'lucide-react';
import { AddAnimalForm } from './add-animal-form';
import { Button } from '@/components/ui/button';
import { FeedPlanDialog } from './feed-plan-dialog';

const getStatusVariant = (
  status: 'Healthy' | 'Sick' | 'Monitoring'
): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'Healthy':
      return 'default';
    case 'Sick':
      return 'destructive';
    case 'Monitoring':
      return 'secondary';
  }
};

export default function LivestockPage() {
  const [livestockData, setLivestockData] =
    useState<Livestock[]>(initialLivestockData);

  const handleAddAnimal = (newAnimal: Omit<Livestock, 'id'>) => {
    setLivestockData((prevData) => [
      ...prevData,
      { ...newAnimal, id: `L${(prevData.length + 1).toString().padStart(3, '0')}` },
    ]);
  };

  const totalAnimals = livestockData.length;
  const healthyAnimals = livestockData.filter(
    (l) => l.healthStatus === 'Healthy'
  ).length;
  const avgProduction =
    livestockData
      .map((l) => parseFloat(l.productionRate))
      .filter((rate) => !isNaN(rate))
      .reduce((acc, cur) => acc + cur, 0) /
      livestockData.filter((l) => !isNaN(parseFloat(l.productionRate))).length ||
    0;

  return (
    <div className="p-4 md:p-6 space-y-6">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Livestock Overview</h2>
        <AddAnimalForm onAddAnimal={handleAddAnimal}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Animal
          </Button>
        </AddAnimalForm>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Livestock"
          value={totalAnimals.toString()}
          icon={Activity}
          description="Total animals on farm"
        />
        <StatCard
          title="Healthy Animals"
          value={`${healthyAnimals} / ${totalAnimals}`}
          icon={HeartPulse}
          description={`${
            totalAnimals > 0
              ? ((healthyAnimals / totalAnimals) * 100).toFixed(0)
              : 0
          }% health rate`}
          iconClass="text-green-500"
        />
        <StatCard
          title="Avg. Production"
          value={`${avgProduction.toFixed(1)} L/day`}
          icon={Droplet}
          description="Average daily milk yield"
          iconClass="text-blue-500"
        />
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Camera className="text-primary" />
            AI-Powered Visual Health Check
            </CardTitle>
            <CardDescription>
            Get a preliminary health assessment by uploading a photo of an animal.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
            The AI will analyze the image and your description to check for visual signs of distress or illness.
            </p>
        </CardContent>
        <CardFooter>
            <Button asChild>
                <Link href="/livestock/health-check">Perform Health Check</Link>
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">
            Livestock Registry
          </CardTitle>
          <CardDescription>
            Detailed records of all animals on the farm. Click on an animal's row to see AI-powered actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Last Checkup</TableHead>
                <TableHead>Production</TableHead>
                <TableHead className="text-right">AI Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestockData.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.id}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(animal.healthStatus)}>
                      {animal.healthStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{animal.birthDate}</TableCell>
                  <TableCell>{animal.lastCheckup}</TableCell>
                  <TableCell>{animal.productionRate}</TableCell>
                  <TableCell className="text-right">
                    <FeedPlanDialog animal={animal}>
                      <Button variant="outline" size="sm">
                        <Bot className="mr-2 h-4 w-4" />
                        Get Feed Plan
                      </Button>
                    </FeedPlanDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

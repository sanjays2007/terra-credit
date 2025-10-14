'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { StatCard } from '@/components/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { waterQualityData } from '@/lib/data';
import { Fish, Waves, Thermometer, Droplets, Bot } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';
import { useFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  temperature: {
    label: 'Temp (°C)',
    color: 'hsl(var(--chart-1))',
  },
  oxygen: {
    label: 'Oxygen (mg/L)',
    color: 'hsl(var(--chart-2))',
  },
  ph: {
    label: 'pH',
    color: 'hsl(var(--chart-3))',
  },
  turbidity: {
    label: 'Turbidity (NTU)',
    color: 'hsl(var(--chart-4))',
  },
};

const getStatusVariant = (
  status: 'Optimal' | 'Warning' | 'Alert'
): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'Optimal':
      return 'default';
    case 'Alert':
      return 'destructive';
    case 'Warning':
      return 'secondary';
  }
};

export default function AquaculturePage() {
  const latestData = waterQualityData[waterQualityData.length - 1];

  const { firestore } = useFirebase();

  const pondsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ponds'), orderBy('name'));
  }, [firestore]);

  const { data: ponds, loading } = useCollection(pondsQuery);

  const stats = useMemo(() => {
    if (!ponds) return { optimal: 0, total: 0 };
    const optimalPonds = ponds.filter(
      (p) => p.status === 'Optimal'
    ).length;
    return { optimal: optimalPonds, total: ponds.length };
  }, [ponds]);


  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pond Status"
          value={`${stats.optimal}/${stats.total}`}
          icon={Waves}
          description={stats.total > 0 ? `${((stats.optimal / stats.total) * 100).toFixed(0)}% Optimal` : "No ponds found"}
          iconClass="text-green-500"
        />
        <StatCard
          title="Water Temperature"
          value={`${latestData.temperature}°C`}
          icon={Thermometer}
          description="Ideal for growth"
          iconClass="text-red-500"
        />
        <StatCard
          title="Dissolved Oxygen"
          value={`${latestData.oxygen} mg/L`}
          icon={Droplets}
          description="Healthy oxygen levels"
          iconClass="text-blue-500"
        />
        <StatCard
          title="Total Fish Stock"
          value="~5,200"
          icon={Fish}
          description="Across all ponds"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" />
            AI Water Quality Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered recommendations based on your pond's water quality
            parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter your current water quality readings to receive an analysis and
            suggestions for maintaining a healthy aquatic environment.
          </p>
          <Button asChild>
            <Link href="/aquaculture/analysis">Perform Analysis</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">
            Digital Pond Registry
          </CardTitle>
          <CardDescription>
            Real-time status of all aquaculture ponds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pond Name</TableHead>
                <TableHead>Fish Species</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Oxygen (mg/L)</TableHead>
                <TableHead>pH</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                </TableRow>
              ))}
              {!loading && ponds?.map((pond) => (
                <TableRow key={pond.id}>
                  <TableCell className="font-medium">{pond.name}</TableCell>
                  <TableCell>{pond.fishSpecies}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pond.status as 'Optimal' | 'Warning' | 'Alert')}>
                      {pond.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{pond.temperature}°C</TableCell>
                  <TableCell>{pond.oxygen} mg/L</TableCell>
                  <TableCell>{pond.ph}</TableCell>
                </TableRow>
              ))}
               {!loading && ponds?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No ponds found.
                    </TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


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
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
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
};

const pondData = [
    { id: 'P001', name: 'Pond A', fishSpecies: 'Tilapia', status: 'Optimal', temperature: 28, oxygen: 6.5, ph: 7.2 },
    { id: 'P002', name: 'Pond B', fishSpecies: 'Catla', status: 'Warning', temperature: 30, oxygen: 5.2, ph: 6.8 },
    { id: 'P003', name: 'Pond C', fishSpecies: 'Rohu', status: 'Alert', temperature: 31, oxygen: 4.5, ph: 7.9 },
    { id: 'P004', name: 'Pond D', fishSpecies: 'Tilapia', status: 'Optimal', temperature: 28.5, oxygen: 7.0, ph: 7.5 },
];


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
  
  const stats = {
    optimal: pondData.filter(p => p.status === 'Optimal').length,
    total: pondData.length,
  };


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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              Water Quality Trends (7-Day)
            </CardTitle>
            <CardDescription>
              Monitoring key parameters for all ponds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <AreaChart
                data={waterQualityData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="var(--color-temperature)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--color-oxygen)"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2 }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend content={<ChartLegendContent />} />
                <Area
                  dataKey="temperature"
                  type="monotone"
                  fill="var(--color-temperature)"
                  fillOpacity={0.4}
                  stroke="var(--color-temperature)"
                  yAxisId="left"
                />
                <Area
                  dataKey="oxygen"
                  type="monotone"
                  fill="var(--color-oxygen)"
                  fillOpacity={0.4}
                  stroke="var(--color-oxygen)"
                  yAxisId="right"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

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
              {pondData.map((pond) => (
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

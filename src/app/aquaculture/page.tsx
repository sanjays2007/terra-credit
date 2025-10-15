
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { getPonds, getWaterQualityHistory } from '@/lib/aquaculture-api';
import { Fish, Waves, Thermometer, Droplets, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WaterQualityChart } from './water-quality-chart';

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

async function DashboardContent() {
  const pondData = await getPonds();
  const waterQualityData = await getWaterQualityHistory();

  const latestData = waterQualityData[waterQualityData.length - 1];
  
  const stats = {
    optimal: pondData.filter(p => p.status === 'Optimal').length,
    total: pondData.length,
  };

  return (
    <>
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
            <WaterQualityChart data={waterQualityData} />
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
    </>
  );
}

function DashboardContentSkeleton() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3 mb-1" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
                <Card><CardHeader className="pb-2"><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3 mb-1" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
                <Card><CardHeader className="pb-2"><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3 mb-1" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
                <Card><CardHeader className="pb-2"><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3 mb-1" /><Skeleton className="h-3 w-3/4" /></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle><CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription></CardHeader>
                    <CardContent><Skeleton className="h-10 w-40" /></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle><CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription></CardHeader>
                    <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader><CardTitle><Skeleton className="h-6 w-1/3" /></CardTitle><CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </>
    )
}

export default function AquaculturePage() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <Suspense fallback={<DashboardContentSkeleton />}>
                <DashboardContent />
            </Suspense>
        </div>
    )
}

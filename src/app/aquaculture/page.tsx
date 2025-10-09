
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { StatCard } from "@/components/stat-card";
import { waterQualityData } from "@/lib/data";
import { Fish, Waves, Thermometer, Droplets, Bot } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const chartConfig = {
  temperature: {
    label: "Temp (°C)",
    color: "hsl(var(--chart-1))",
  },
  oxygen: {
    label: "Oxygen (mg/L)",
    color: "hsl(var(--chart-2))",
  },
  ph: {
    label: "pH",
    color: "hsl(var(--chart-3))",
  },
  turbidity: {
    label: "Turbidity (NTU)",
    color: "hsl(var(--chart-4))",
  },
};

export default function AquaculturePage() {
  const latestData = waterQualityData[waterQualityData.length - 1];

  return (
    <div className="p-4 md:p-6 space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pond Status"
          value="Optimal"
          icon={Waves}
          description="All parameters within range"
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
          title="Fish Stock"
          value="~5,200"
          icon={Fish}
          description="Rohu & Catla species"
        />
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Bot className="text-primary" />
              AI Water Quality Analysis
            </CardTitle>
            <CardDescription>
              Get AI-powered recommendations based on your pond's water quality parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Enter your current water quality readings to receive an analysis and suggestions for maintaining a healthy aquatic environment.
            </p>
            <Button asChild>
              <Link href="/aquaculture/analysis">Perform Analysis</Link>
            </Button>
          </CardContent>
        </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">
            Water Quality Trends - Pond A
          </CardTitle>
          <CardDescription>
            Real-time monitoring of critical water parameters over the last 7
            days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart data={waterQualityData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOxygen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-oxygen)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-oxygen)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)}
              />
               <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[24, 30]}
                tickFormatter={(value) => `${value}°C`}
              />
               <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[6, 8]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#colorTemp)"
                stroke="var(--color-temperature)"
                stackId="a"
                yAxisId="left"
              />
              <Area
                dataKey="oxygen"
                type="natural"
                fill="url(#colorOxygen)"
                stroke="var(--color-oxygen)"
                stackId="b"
                yAxisId="right"
              />
               <Area
                dataKey="ph"
                type="natural"
                fill="var(--color-ph)"
                stroke="var(--color-ph)"
                stackId="c"
                yAxisId="right"
                opacity={0.3}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

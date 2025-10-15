
'use client';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
  } from '@/components/ui/chart';
import type { WaterQuality } from '@/lib/types';
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

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

interface WaterQualityChartProps {
    data: WaterQuality[];
}

export function WaterQualityChart({ data }: WaterQualityChartProps) {
    return (
        <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart
            data={data}
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
            <ChartLegend content={<ChartLegendContent />} />
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
    )
}

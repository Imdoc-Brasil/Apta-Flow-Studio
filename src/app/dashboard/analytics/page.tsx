'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from 'recharts';
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
} from '@/components/ui/chart';

const chartData1 = [
  { month: 'January', tickets: 186 },
  { month: 'February', tickets: 305 },
  { month: 'March', tickets: 237 },
  { month: 'April', tickets: 273 },
  { month: 'May', tickets: 209 },
  { month: 'June', tickets: 214 },
];

const chartConfig1 = {
  tickets: {
    label: 'Tickets',
    color: 'hsl(var(--chart-1))',
  },
};

const chartData2 = [
  { date: '2024-01-01', avgResolutionTime: 8.5 },
  { date: '2024-01-02', avgResolutionTime: 7.2 },
  { date: '2024-01-03', avgResolutionTime: 9.1 },
  { date: '2024-01-04', avgResolutionTime: 6.8 },
  { date: '2024-01-05', avgResolutionTime: 7.5 },
  { date: '2024-01-06', avgResolutionTime: 8.2 },
  { date: '2024-01-07', avgResolutionTime: 7.9 },
];

const chartConfig2 = {
  avgResolutionTime: {
    label: 'Avg. Resolution (h)',
    color: 'hsl(var(--chart-2))',
  },
};

export default function AnalyticsPage() {
  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <h1 className="font-headline text-3xl font-bold">Analytics & Reporting</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ticket Volume by Month</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig1} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData1}>
                 <CartesianGrid vertical={false} />
                 <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="tickets" fill="var(--color-tickets)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Average Resolution Time</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig2} className="h-[300px] w-full">
                <LineChart accessibilityLayer data={chartData2} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                   <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short'})}
                  />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Line
                    dataKey="avgResolutionTime"
                    type="natural"
                    stroke="var(--color-avgResolutionTime)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-avgResolutionTime)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

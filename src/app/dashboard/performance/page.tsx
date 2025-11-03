'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const slaData = [
  { name: 'Met SLA', value: 392, fill: 'var(--color-met)' },
  { name: 'Missed SLA', value: 8, fill: 'var(--color-missed)' },
];

const slaConfig = {
  value: {
    label: 'Tickets',
  },
  met: {
    label: 'Met SLA',
    color: 'hsl(var(--chart-1))',
  },
  missed: {
    label: 'Missed SLA',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

const okrData = [
    { goal: "Improve CSAT", progress: 75, target: 100 },
    { goal: "Reduce Churn", progress: 40, target: 100 },
    { goal: "Upsell Revenue", progress: 90, target: 100 },
];

const okrConfig = {
    progress: {
        label: "Progress",
        color: "hsl(var(--chart-2))",
    },
    target: {
        label: "Target",
        color: "hsl(var(--muted))"
    }
} satisfies ChartConfig;


export default function PerformancePage() {
  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <h1 className="font-headline text-3xl font-bold">Performance Monitoring</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer
              config={slaConfig}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={slaData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                    <LabelList
                        dataKey="name"
                        className="fill-background"
                        stroke="none"
                        fontSize={12}
                        formatter={(value: keyof typeof slaConfig) =>
                        slaConfig[value]?.label
                        }
                    />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              98% Compliance Rate <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total tickets for the last 30 days
            </div>
          </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>OKR Progress - Q3 2024</CardTitle>
                <CardDescription>Current progress towards key results.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={okrConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={okrData} layout="vertical" margin={{left: 10}}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="goal" type="category" tickLine={false} tickMargin={10} axisLine={false} className="text-muted-foreground text-xs" width={100} />
                        <XAxis dataKey="target" type="number" hide={true} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="target" layout="vertical" fill="var(--color-target)" radius={4} />
                        <Bar dataKey="progress" layout="vertical" fill="var(--color-progress)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
             <CardFooter className="flex-col gap-2 text-sm items-start">
                 <div className="leading-none text-muted-foreground">
                    Progress is measured against quarterly targets.
                </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}

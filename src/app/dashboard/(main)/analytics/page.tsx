
'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'
import { collection, query, where } from 'firebase/firestore'
import { type Ticket } from '@/lib/types/ticket'
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval, differenceInHours, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig1 = {
  tickets: {
    label: 'Tickets',
    color: 'hsl(var(--chart-1))',
  },
}

const chartConfig2 = {
  avgResolutionTime: {
    label: 'Tempo Médio Res. (h)',
    color: 'hsl(var(--chart-2))',
  },
}

export default function AnalyticsPage() {
  const firestore = useFirestore()

  const ticketsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tickets') : null),
    [firestore]
  )

  const { data: tickets, isLoading: areTicketsLoading } =
    useCollection<Ticket>(ticketsRef)

  const monthlyTicketVolume = useMemo(() => {
    if (!tickets) return []

    const now = new Date()
    const sixMonthsAgo = subDays(now, 180)
    const interval = { start: startOfMonth(sixMonthsAgo), end: endOfMonth(now) }
    
    const months = eachMonthOfInterval(interval).map(month => ({
      month: format(month, 'MMMM', { locale: ptBR }),
      tickets: 0,
    }))

    const monthMap = new Map(months.map(m => [m.month.toLowerCase(), m]));

    tickets.forEach(ticket => {
      if (!ticket.createdAt) return;
      const ticketDate = new Date(ticket.createdAt);
      if (ticketDate >= interval.start && ticketDate <= interval.end) {
        const monthName = format(ticketDate, 'MMMM', { locale: ptBR }).toLowerCase();
        const monthData = monthMap.get(monthName)
        if (monthData) {
          monthData.tickets++;
        }
      }
    });

    return Array.from(monthMap.values());
  }, [tickets])

  const weeklyResolutionTime = useMemo(() => {
    if (!tickets) return [];

    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();

    return last7Days.map(day => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));

      const resolvedTickets = tickets.filter(
        ticket =>
          (ticket.status === 'Resolvido' || ticket.status === 'Fechado') &&
          isValid(parseISO(ticket.createdAt)) &&
          isValid(parseISO(ticket.updated)) &&
          parseISO(ticket.updated) >= dayStart &&
          parseISO(ticket.updated) <= dayEnd
      );

      if (resolvedTickets.length === 0) {
        return {
          date: format(day, 'yyyy-MM-dd'),
          avgResolutionTime: 0,
        };
      }
      
      const totalTime = resolvedTickets.reduce((acc, ticket) => {
         const createdAt = parseISO(ticket.createdAt);
         const resolvedAt = parseISO(ticket.updated);
         return acc + differenceInHours(resolvedAt, createdAt);
      }, 0);

      return {
        date: format(day, 'yyyy-MM-dd'),
        avgResolutionTime: parseFloat((totalTime / resolvedTickets.length).toFixed(1)),
      };
    });
  }, [tickets]);


  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <h1 className='font-headline text-3xl font-bold'>Análise e Relatórios</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Volume de Tickets por Mês</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <ChartContainer config={chartConfig1} className='h-[300px] w-full'>
              <BarChart accessibilityLayer data={monthlyTicketVolume}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey='tickets' fill='var(--color-tickets)' radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Tempo Médio de Resolução</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig2} className='h-[300px] w-full'>
              <LineChart
                accessibilityLayer
                data={weeklyResolutionTime}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    })
                  }
                />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator='dot' />}
                />
                <Line
                  dataKey='avgResolutionTime'
                  type='natural'
                  stroke='var(--color-avgResolutionTime)'
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-avgResolutionTime)',
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
  )
}


import {
  Activity,
  ArrowUpRight,
  Briefcase,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

const kpiData = [
  {
    title: 'Clientes Ativos',
    value: '+45',
    description: '+12% do último mês',
    icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Tickets Abertos',
    value: '127',
    description: '+5 desde a última hora',
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Conformidade de SLA',
    value: '98.2%',
    description: 'Meta: 98%',
    icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Projetos Ativos',
    value: '12',
    description: '+2 do último mês',
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
];

const recentActivity = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    action: 'Novo Ticket',
    details: '#TKT-2024-078',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    action: 'Contrato Assinado',
    details: 'Innovate Inc.',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    action: 'SLA Cumprido',
    details: 'Projeto Phoenix',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    action: 'Novo Cliente',
    details: 'Acme Corp',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    action: 'Ticket Fechado',
    details: '#TKT-2024-075',
  },
];

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Um registro de atividades recentes em toda a plataforma.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                Ver Tudo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{activity.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {activity.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activity.action.includes('Novo') ? 'default' : 'secondary'} className="text-xs" >{activity.action}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {activity.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Novos Funcionários</CardTitle>
            <CardDescription>
              Dando as boas-vindas aos mais novos membros da nossa equipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704a" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  Gerente de Projeto
                </p>
              </div>
              <div className="ml-auto font-medium">Entrou Hoje</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704b" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  Engenheiro de Software
                </p>
              </div>
              <div className="ml-auto font-medium">Entrou Ontem</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

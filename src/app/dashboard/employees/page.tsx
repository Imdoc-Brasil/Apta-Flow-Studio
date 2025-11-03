import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const employeesData = [
  {
    name: 'Sarah Chen',
    role: 'Gerente de Projeto Principal',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026701d',
    fallback: 'SC',
    email: 'sarah.chen@aptaflow.com',
    phone: '555-0101',
    responsibilities: ['Integração de Clientes', 'Monitoramento de SLA', 'Conta Innovate Inc.'],
  },
  {
    name: 'David Rodriguez',
    role: 'Engenheiro de Software Sênior',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
    fallback: 'DR',
    email: 'david.r@aptaflow.com',
    phone: '555-0102',
    responsibilities: ['Desenvolvimento Backend', 'Manutenção de API', 'Líder do Projeto Phoenix'],
  },
  {
    name: 'Emily White',
    role: 'Especialista de Suporte',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
    fallback: 'EW',
    email: 'emily.w@aptaflow.com',
    phone: '555-0103',
    responsibilities: ['Suporte Nível 1', 'Triagem de Tickets', 'Comunicação com Cliente'],
  },
   {
    name: 'Michael Brown',
    role: 'Engenheiro de DevOps',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    fallback: 'MB',
    email: 'michael.b@aptaflow.com',
    phone: '555-0104',
    responsibilities: ['Pipeline CI/CD', 'Infraestrutura', 'Auditorias de Segurança'],
  },
];

export default function EmployeesPage() {
  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <h1 className="font-headline text-3xl font-bold">Hub de Funcionários</h1>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {employeesData.map((employee) => (
          <Card key={employee.name}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{employee.fallback}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{employee.name}</CardTitle>
                <CardDescription>{employee.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <h4 className="text-sm font-medium mb-2">Informações de Contato</h4>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                </div>
               </div>
               <div>
                 <h4 className="text-sm font-medium mb-2">Principais Responsabilidades</h4>
                <div className="flex flex-wrap gap-1">
                    {employee.responsibilities.map((resp) => (
                        <Badge key={resp} variant="secondary">{resp}</Badge>
                    ))}
                </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

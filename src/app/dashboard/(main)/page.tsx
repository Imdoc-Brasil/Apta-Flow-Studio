
'use client'

import { useEffect } from 'react'
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  CreditCard,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { useTicketStore } from './tickets/tickets-store'
import {
  useUser,
  useFirestore,
  errorEmitter,
  FirestorePermissionError,
  useCollection,
  useMemoFirebase,
  setDocumentNonBlocking,
} from '@/firebase'
import { doc, getDoc, serverTimestamp, collection } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import type { Client } from './clients/data'
import type { Staff } from './employees/page'

const kpiDataStatic = [
  {
    title: 'Conformidade de SLA',
    value: '98.2%',
    description: 'Meta: 98%',
    icon: <CreditCard className='h-4 w-4 text-muted-foreground' />,
  },
  {
    title: 'Projetos Ativos',
    value: '12',
    description: '+2 do último mês',
    icon: <Activity className='h-4 w-4 text-muted-foreground' />,
  },
]

export default function Dashboard() {
  const { tickets } = useTicketStore()
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )
  const { data: clients } = useCollection<Client>(clientsRef)

  const staffsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'staffs') : null),
    [firestore]
  )
  const { data: staffs } = useCollection<Staff>(staffsRef)

  useEffect(() => {
    const promoteToSuperAdmin = async () => {
      if (!user || !firestore) return

      const adminRoleRef = doc(firestore, 'roles_admin', user.uid)
      try {
        const docSnap = await getDoc(adminRoleRef)
        if (!docSnap.exists()) {
          const creationData = { createdAt: serverTimestamp() }
          // User is not an admin yet, promote them.
          // This is a non-blocking write with specific error handling.
          setDocumentNonBlocking(adminRoleRef, creationData, { merge: true })

          toast({
            title: 'Bem-vindo, Superadministrador!',
            description:
              'Sua conta foi elevada para o nível de superadministrador.',
          })
        }
      } catch (error) {
        // This will catch errors from getDoc, which is less likely to be a permission issue
        // for this specific logic, but good to have.
        const permissionError = new FirestorePermissionError({
          path: adminRoleRef.path,
          operation: 'get',
        })
        errorEmitter.emit('permission-error', permissionError)
      }
    }

    if (!isUserLoading && user) {
      promoteToSuperAdmin()
    }
  }, [user, isUserLoading, firestore, toast])

  const activeClientsCount = clients?.filter(
    (c) => c.status === 'Ativo'
  ).length

  const openTicketsCount = tickets.filter((t) => t.status === 'Aberto').length

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 5)

  const newStaffs = (staffs || []).slice(0, 2)

  const kpiDataDynamic = [
    {
      title: 'Clientes Ativos',
      value: `+${activeClientsCount || 0}`,
      description: `Total de ${clients?.length || 0} clientes`,
      icon: <Briefcase className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: 'Tickets Abertos',
      value: `${openTicketsCount}`,
      description: `${
        tickets.filter((t) => t.status === 'Em Progresso').length
      } em progresso`,
      icon: <Users className='h-4 w-4 text-muted-foreground' />,
    },
  ]

  const kpiData = [...kpiDataDynamic, ...kpiDataStatic]

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{kpi.value}</div>
              <p className='text-xs text-muted-foreground'>
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Tickets Recentes</CardTitle>
              <CardDescription>
                As solicitações de serviço mais recentes.
              </CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/dashboard/tickets'>
                Ver Todos
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead>Assunto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className='font-medium'>{ticket.client}</div>
                      <div className='hidden text-sm text-muted-foreground md:inline'>
                        {ticket.id}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Badge
                        className='text-xs'
                        variant={
                          ticket.status === 'Aberto' ? 'default' : 'secondary'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staffs Recentes</CardTitle>
            <CardDescription>
              Dando as boas-vindas aos mais novos membros da nossa equipe.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-8'>
            {newStaffs.map((staff, index) => (
              <div key={staff.email} className='flex items-center gap-4'>
                <Avatar className='hidden h-9 w-9 sm:flex'>
                  <AvatarImage src={staff.avatar} alt='Avatar' />
                  <AvatarFallback>{staff.fallback}</AvatarFallback>
                </Avatar>
                <div className='grid gap-1'>
                  <p className='text-sm font-medium leading-none'>
                    {staff.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {staff.assinatura}
                  </p>
                </div>
                <div className='ml-auto font-medium'>
                  {index === 0 ? 'Entrou Hoje' : 'Entrou Ontem'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

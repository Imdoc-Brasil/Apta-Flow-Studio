import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const clientsData = [
  {
    name: 'Innovate Inc.',
    contractId: 'CTR-2024-001',
    status: 'Active',
    contact: 'liam.johnson@innovate.com',
    plan: 'Enterprise',
  },
  {
    name: 'Solutions Co.',
    contractId: 'CTR-2024-002',
    status: 'Active',
    contact: 'olivia.smith@solutions.com',
    plan: 'Pro',
  },
  {
    name: 'Quantum Dynamics',
    contractId: 'CTR-2023-015',
    status: 'Onboarding',
    contact: 'noah.williams@quantum.com',
    plan: 'Enterprise',
  },
  {
    name: 'Stellar Tech',
    contractId: 'CTR-2024-004',
    status: 'Active',
    contact: 'emma.brown@stellar.com',
    plan: 'Pro',
  },
  {
    name: 'Apex Innovations',
    contractId: 'CTR-2022-008',
    status: 'Inactive',
    contact: 'ava.jones@apex.com',
    plan: 'Basic',
  },
];

export default function ClientsPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="inactive" className="hidden sm:flex">
            Inactive
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Onboarding</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Client
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Manage your clients and their service agreements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Plan
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Contract ID
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData.map((client) => (
                  <TableRow key={client.contractId}>
                    <TableCell className="font-medium">
                      {client.name}
                      <div className="text-sm text-muted-foreground md:hidden">{client.contact}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'secondary' : client.status === 'Onboarding' ? 'default' : 'outline'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.plan}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.contractId}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Contracts</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-5</strong> of <strong>5</strong> clients
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

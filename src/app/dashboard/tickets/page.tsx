import {
  MoreHorizontal,
  PlusCircle,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
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

const ticketsData = [
  { id: 'TKT-001', subject: 'Cannot login to portal', client: 'Innovate Inc.', priority: 'High', status: 'Open', updated: '2024-07-21 10:30 AM' },
  { id: 'TKT-002', subject: 'Feature Request: Dark Mode', client: 'Solutions Co.', priority: 'Medium', status: 'In Progress', updated: '2024-07-21 09:15 AM' },
  { id: 'TKT-003', subject: 'Billing Inquiry', client: 'Stellar Tech', priority: 'Low', status: 'Open', updated: '2024-07-20 04:00 PM' },
  { id: 'TKT-004', subject: 'API endpoint returning 500 error', client: 'Quantum Dynamics', priority: 'High', status: 'Resolved', updated: '2024-07-19 11:00 AM' },
  { id: 'TKT-005', subject: 'Onboarding question', client: 'Apex Innovations', priority: 'Low', status: 'Closed', updated: '2024-07-18 02:45 PM' },
];

const priorityVariant = {
    'High': 'destructive',
    'Medium': 'default',
    'Low': 'secondary'
} as const;

const statusVariant = {
    'Open': 'default',
    'In Progress': 'secondary',
    'Resolved': 'outline',
    'Closed': 'outline'
} as const;


export default function TicketsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>Service Tickets</CardTitle>
                <CardDescription>
                Track and manage client service requests.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Ticket
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketsData.map((ticket) => (
                <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell className="hidden md:table-cell">{ticket.client}</TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[ticket.priority as keyof typeof priorityVariant]}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[ticket.status as keyof typeof statusVariant]}>{ticket.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{ticket.updated}</TableCell>
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

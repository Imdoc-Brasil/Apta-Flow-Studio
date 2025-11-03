import {
  MoreHorizontal,
  PlusCircle,
  Upload,
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

const documentsData = [
  { name: 'InnovateInc_MSA_2024.pdf', type: 'Contract', size: '2.5 MB', modified: '2024-07-15', relatedTo: 'Innovate Inc.'},
  { name: 'Q1_2024_Performance_Report.docx', type: 'Report', size: '800 KB', modified: '2024-04-05', relatedTo: 'All Clients'},
  { name: 'Project_Phoenix_SOW.pdf', type: 'SOW', size: '1.2 MB', modified: '2024-06-20', relatedTo: 'Solutions Co.'},
  { name: 'Onboarding_Checklist_Quantum.xlsx', type: 'Checklist', size: '300 KB', modified: '2023-11-10', relatedTo: 'Quantum Dynamics'},
  { name: 'StellarTech_SLA.pdf', type: 'SLA', size: '600 KB', modified: '2024-02-01', relatedTo: 'Stellar Tech'},
];

export default function DocumentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Repository</CardTitle>
        <CardDescription>
          Secure storage and management of contracts, documentation, and reports.
        </CardDescription>
        <div className="flex items-center gap-2 pt-4">
            <Button size="sm" className="h-8 gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Upload Document
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Related To</TableHead>
              <TableHead className="hidden md:table-cell">Last Modified</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentsData.map((doc) => (
                <TableRow key={doc.name}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                 <TableCell className="hidden sm:table-cell">{doc.relatedTo}</TableCell>
                <TableCell className="hidden md:table-cell">{doc.modified}</TableCell>
                <TableCell className="text-right">{doc.size}</TableCell>
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
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
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
    </Card>
  );
}

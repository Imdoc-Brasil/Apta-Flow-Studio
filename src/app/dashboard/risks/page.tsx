'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

function PlaceholderContent({ category }: { category: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Riscos de {category}
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Risco
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os riscos {category.toLowerCase()} identificados no ambiente de trabalho.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum risco de {category.toLowerCase()} cadastrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece adicionando um novo risco para esta categoria.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RisksPage() {
  const riskCategories = [
    { value: 'fisicos', label: 'Físicos' },
    { value: 'quimicos', label: 'Químicos' },
    { value: 'biologicos', label: 'Biológicos' },
    { value: 'ergonomicos', label: 'Ergonômicos' },
    { value: 'acidentes', label: 'Acidentes' },
    { value: 'psicossociais', label: 'Psicossociais' },
  ];

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Gestão de Riscos Ocupacionais
        </h1>
      </div>
      <Tabs defaultValue={riskCategories[0].value}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {riskCategories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {riskCategories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <PlaceholderContent category={cat.label} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

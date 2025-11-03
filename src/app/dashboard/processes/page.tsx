'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { suggestProcessTool, SuggestProcessToolOutput } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PlaceholderContent({ toolName }: { toolName: string }) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Quadro {toolName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Seus componentes e lógica do quadro {toolName} seriam exibidos aqui.
            </p>
          </div>
        </div>
    )
}

export default function ProcessesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestProcessToolOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const projectDescription = formData.get('description') as string;

    if (!projectDescription.trim()) {
      setError('Por favor, forneça uma descrição do projeto.');
      setLoading(false);
      return;
    }

    try {
      const aiResult = await suggestProcessTool({ projectDescription });
      setResult(aiResult);
    } catch (e) {
      setError('Falha ao obter sugestão. Por favor, tente novamente.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <h1 className="font-headline text-3xl font-bold">Gestão de Processos</h1>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Sugestão de Ferramenta por IA
              </CardTitle>
              <CardDescription>
                Descreva seu projeto, e nossa IA irá sugerir a melhor ferramenta
                de gestão de processos para o trabalho.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Textarea
                  name="description"
                  placeholder="ex: 'Precisamos desenvolver um novo recurso de aplicativo móvel para autenticação de usuário. A equipe é pequena e os requisitos podem mudar. Precisamos visualizar o fluxo de trabalho e limitar o trabalho em andamento.'"
                  className="min-h-[120px]"
                  disabled={loading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sugerir Ferramenta
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Sugestão</CardTitle>
                <CardDescription>Recomendação da IA baseada no seu projeto.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[220px] flex items-center justify-center">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                {!loading && !result && <div className="text-center text-muted-foreground">Sua sugestão aparecerá aqui.</div>}
                {result && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">Ferramenta Sugerida: <span className="text-primary font-bold">{result.toolName}</span></h3>
                        </div>
                        <div>
                             <h4 className="font-semibold">Justificativa:</h4>
                            <p className="text-muted-foreground">{result.justification}</p>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="kanban" className="w-full">
            <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                <TabsTrigger value="pdca">PDCA</TabsTrigger>
                <TabsTrigger value="5w2h">5W2H</TabsTrigger>
                <TabsTrigger value="fishbone">Diagrama de Ishikawa</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban"><PlaceholderContent toolName="Kanban" /></TabsContent>
            <TabsContent value="timeline"><PlaceholderContent toolName="Linha do Tempo" /></TabsContent>
            <TabsContent value="pdca"><PlaceholderContent toolName="PDCA" /></TabsContent>
            <TabsContent value="5w2h"><PlaceholderContent toolName="5W2H" /></TabsContent>
            <TabsContent value="fishbone"><PlaceholderContent toolName="Diagrama de Ishikawa" /></TabsContent>
        </Tabs>
    </div>
  );
}

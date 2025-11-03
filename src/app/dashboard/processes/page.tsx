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
              {toolName} Board
            </h3>
            <p className="text-sm text-muted-foreground">
              Your {toolName} board components and logic would be displayed here.
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
      setError('Please provide a project description.');
      setLoading(false);
      return;
    }

    try {
      const aiResult = await suggestProcessTool({ projectDescription });
      setResult(aiResult);
    } catch (e) {
      setError('Failed to get suggestion. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <h1 className="font-headline text-3xl font-bold">Process Management</h1>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI Tool Suggester
              </CardTitle>
              <CardDescription>
                Describe your project, and our AI will suggest the best process
                management tool for the job.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Textarea
                  name="description"
                  placeholder="e.g., 'We need to develop a new mobile app feature for user authentication. The team is small, and requirements might change. We need to visualize workflow and limit work-in-progress.'"
                  className="min-h-[120px]"
                  disabled={loading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suggest Tool
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Suggestion</CardTitle>
                <CardDescription>AI-powered recommendation based on your project.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[220px] flex items-center justify-center">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                {!loading && !result && <div className="text-center text-muted-foreground">Your suggestion will appear here.</div>}
                {result && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">Suggested Tool: <span className="text-primary font-bold">{result.toolName}</span></h3>
                        </div>
                        <div>
                             <h4 className="font-semibold">Justification:</h4>
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
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="pdca">PDCA</TabsTrigger>
                <TabsTrigger value="5w2h">5W2H</TabsTrigger>
                <TabsTrigger value="fishbone">Fishbone</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban"><PlaceholderContent toolName="Kanban" /></TabsContent>
            <TabsContent value="timeline"><PlaceholderContent toolName="Timeline" /></TabsContent>
            <TabsContent value="pdca"><PlaceholderContent toolName="PDCA" /></TabsContent>
            <TabsContent value="5w2h"><PlaceholderContent toolName="5W2H" /></TabsContent>
            <TabsContent value="fishbone"><PlaceholderContent toolName="Fishbone" /></TabsContent>
        </Tabs>
    </div>
  );
}

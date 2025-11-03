'use server';

/**
 * @fileOverview A process management tool suggestion AI agent.
 *
 * - suggestProcessTool - A function that suggests a process management tool based on project description.
 * - SuggestProcessToolInput - The input type for the suggestProcessTool function.
 * - SuggestProcessToolOutput - The return type for the suggestProcessTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProcessToolInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A detailed description of the project for which a process management tool is needed.'),
});
export type SuggestProcessToolInput = z.infer<typeof SuggestProcessToolInputSchema>;

const SuggestProcessToolOutputSchema = z.object({
  toolName: z.string().describe('The name of the suggested process management tool (e.g., Kanban, Timeline, PDCA, 5W2H, Fishbone).'),
  justification: z.string().describe('A brief justification for why the suggested tool is appropriate for the given project description.'),
});
export type SuggestProcessToolOutput = z.infer<typeof SuggestProcessToolOutputSchema>;

export async function suggestProcessTool(input: SuggestProcessToolInput): Promise<SuggestProcessToolOutput> {
  return suggestProcessToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProcessToolPrompt',
  input: {schema: SuggestProcessToolInputSchema},
  output: {schema: SuggestProcessToolOutputSchema},
  prompt: `You are an AI assistant specializing in project management methodologies. Based on the project description provided, suggest the most suitable process management tool from the following options: Kanban, Timeline, PDCA, 5W2H, Fishbone. Provide a brief justification for your suggestion.

Project Description: {{{projectDescription}}}

Tool Suggestion:`,
});

const suggestProcessToolFlow = ai.defineFlow(
  {
    name: 'suggestProcessToolFlow',
    inputSchema: SuggestProcessToolInputSchema,
    outputSchema: SuggestProcessToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

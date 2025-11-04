'use server'

/**
 * @fileOverview A process management tool suggestion AI agent.
 *
 * - suggestProcessTool - A function that suggests a process management tool based on project description.
 * - SuggestProcessToolInput - The input type for the suggestProcessTool function.
 * - SuggestProcessToolOutput - The return type for the suggestProcessTool function.
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit'

const SuggestProcessToolInputSchema = z.object({
  projectDescription: z
    .string()
    .describe(
      'Uma descrição detalhada do projeto para o qual uma ferramenta de gerenciamento de processos é necessária.'
    ),
})
export type SuggestProcessToolInput = z.infer<
  typeof SuggestProcessToolInputSchema
>

const SuggestProcessToolOutputSchema = z.object({
  toolName: z
    .string()
    .describe(
      'O nome da ferramenta de gerenciamento de processos sugerida (por exemplo, Kanban, Linha do Tempo, PDCA, 5W2H, Diagrama de Ishikawa).'
    ),
  justification: z
    .string()
    .describe(
      'Uma breve justificativa do porquê a ferramenta sugerida é apropriada para a descrição do projeto fornecida.'
    ),
})
export type SuggestProcessToolOutput = z.infer<
  typeof SuggestProcessToolOutputSchema
>

export async function suggestProcessTool(
  input: SuggestProcessToolInput
): Promise<SuggestProcessToolOutput> {
  return suggestProcessToolFlow(input)
}

const prompt = ai.definePrompt({
  name: 'suggestProcessToolPrompt',
  input: { schema: SuggestProcessToolInputSchema },
  output: { schema: SuggestProcessToolOutputSchema },
  prompt: `Você é um assistente de IA especializado em metodologias de gerenciamento de projetos. Com base na descrição do projeto fornecida, sugira a ferramenta de gerenciamento de processos mais adequada entre as seguintes opções: Kanban, Linha do Tempo, PDCA, 5W2H, Diagrama de Ishikawa. Forneça uma breve justificativa para sua sugestão.

Descrição do Projeto: {{{projectDescription}}}

Sugestão de Ferramenta:`,
})

const suggestProcessToolFlow = ai.defineFlow(
  {
    name: 'suggestProcessToolFlow',
    inputSchema: SuggestProcessToolInputSchema,
    outputSchema: SuggestProcessToolOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  }
)

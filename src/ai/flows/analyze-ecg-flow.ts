'use server'

/**
 * @fileOverview An ECG analysis AI agent.
 *
 * - analyzeEcg - A function that handles the ECG analysis process.
 * - AnalyzeEcgInput - The input type for the analyzeEcg function.
 * - AnalyzeEcgOutput - The return type for the analyzeEcg function.
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit'

const AnalyzeEcgInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "An ECG exam file (image or PDF), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
})
export type AnalyzeEcgInput = z.infer<typeof AnalyzeEcgInputSchema>

const AnalyzeEcgOutputSchema = z.object({
  ritmoCardiaco: z.string().describe('Análise do ritmo cardíaco (ex: Ritmo sinusal, taquicardia).'),
  intervalos: z.string().describe('Análise dos intervalos PR, QRS e QT.'),
  analiseST: z.string().describe('Análise do segmento ST e da onda T.'),
  conclusao: z.string().describe('Conclusão geral do exame.'),
  observacoes: z.string().describe('Observações ou recomendações adicionais.'),
})
export type AnalyzeEcgOutput = z.infer<typeof AnalyzeEcgOutputSchema>

export async function analyzeEcg(input: AnalyzeEcgInput): Promise<AnalyzeEcgOutput> {
  return analyzeEcgFlow(input)
}

const prompt = ai.definePrompt({
  name: 'analyzeEcgPrompt',
  input: { schema: AnalyzeEcgInputSchema },
  output: { schema: AnalyzeEcgOutputSchema },
  prompt: `Você é um cardiologista especialista em laudar exames de eletrocardiograma (ECG). Sua tarefa é analisar o arquivo de exame fornecido e gerar um laudo técnico preliminar.

Analise a imagem do ECG a seguir:
{{media url=fileDataUri}}

Preencha os campos a seguir com sua análise técnica detalhada:
- Ritmo Cardíaco: Descreva o ritmo cardíaco observado.
- Intervalos: Descreva os intervalos PR, QRS e QT.
- Análise de Segmento ST e Onda T: Descreva quaisquer anormalidades ou observações.
- Conclusão: Forneça uma conclusão resumida dos seus achados.
- Observações/Recomendações: Adicione quaisquer observações ou recomendações clínicas pertinentes.`,
})

const analyzeEcgFlow = ai.defineFlow(
  {
    name: 'analyzeEcgFlow',
    inputSchema: AnalyzeEcgInputSchema,
    outputSchema: AnalyzeEcgOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  }
)

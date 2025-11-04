'use server';

import { suggestProcessTool as originalSuggestProcessTool, type SuggestProcessToolInput, type SuggestProcessToolOutput } from '@/ai/flows/suggest-process-tool';

export async function suggestProcessTool(input: SuggestProcessToolInput): Promise<SuggestProcessToolOutput> {
    return originalSuggestProcessTool(input);
}

export type { SuggestProcessToolInput, SuggestProcessToolOutput };

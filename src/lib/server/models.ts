import type { ModelTier } from '#lib/models.ts';

export const GEMINI_MODELS: Record<ModelTier, string> = {
  lite: 'gemini-3.5-flash-lite',
  fast: 'gemini-3.6-flash',
  smart: 'gemini-3.8-flash'
};

export function tierOf(model: string): ModelTier | null {
  const entry = Object.entries(GEMINI_MODELS).find(([, name]) => name === model);
  return (entry?.[0] as ModelTier | undefined) ?? null;
}

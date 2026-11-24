export const MODEL_TIERS = ['lite', 'fast', 'smart'] as const;
export type ModelTier = (typeof MODEL_TIERS)[number];

export const DEFAULT_MODEL_TIER: ModelTier = 'fast';

export const MODEL_TIER_INFO: Record<ModelTier, { label: string; description: string }> = {
  lite: { label: 'Lite', description: 'Quickest, lighter on detail' },
  fast: { label: 'Fast', description: 'Balanced speed and quality' },
  smart: { label: 'Smart', description: 'Most thorough, may be slower' }
};

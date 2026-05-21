import { imagePromptSet } from './imagePromptEngine';

type ImageNiche = 'trading' | 'photography' | 'beauty' | 'technology';

type GeneratedImages = {
  hero?: string;
  showcase?: string;
  mockup?: string;
  background?: string;
  source: 'openai' | 'fallback' | 'cache';
  error?: string;
};

type CachedImage = {
  value: GeneratedImages;
  expiresAt: number;
};

const imageCache = new Map<string, CachedImage>();
const CACHE_TTL = 1000 * 60 * 60;

function cacheKey(niche: ImageNiche, sub = '') {
  return `${niche}:${sub.toLowerCase().trim()}`;
}

function getCached(key: string) {
  const cached = imageCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    imageCache.delete(key);
    return null;
  }
  return { ...cached.value, source: 'cache' as const };
}

function setCached(key: string, value: GeneratedImages) {
  if (value.source === 'openai') {
    imageCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
  }
}

async function generateOpenAIImage(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
      prompt,
      size: process.env.OPENAI_IMAGE_SIZE || '1536x1024',
      n: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const b64 = data?.data?.[0]?.b64_json;
  const url = data?.data?.[0]?.url;

  if (b64) return `data:image/png;base64,${b64}`;
  if (url) return url;

  return null;
}

async function safeGenerate(prompt: string) {
  try {
    return await generateOpenAIImage(prompt);
  } catch {
    return null;
  }
}

export async function generateRealImages(niche: ImageNiche, sub = ''): Promise<GeneratedImages> {
  if (!process.env.OPENAI_API_KEY) {
    return { source: 'fallback' };
  }

  const key = cacheKey(niche, sub);
  const cached = getCached(key);
  if (cached) return cached;

  try {
    const prompts = imagePromptSet(niche, sub);

    const [hero, showcase, mockup, background] = await Promise.all([
      safeGenerate(prompts.hero),
      safeGenerate(prompts.showcase),
      safeGenerate(prompts.mockup),
      safeGenerate(prompts.background),
    ]);

    const result: GeneratedImages = {
      hero: hero || undefined,
      showcase: showcase || undefined,
      mockup: mockup || undefined,
      background: background || undefined,
      source: hero || showcase || mockup || background ? 'openai' : 'fallback',
    };

    setCached(key, result);
    return result;
  } catch (error) {
    return {
      source: 'fallback',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

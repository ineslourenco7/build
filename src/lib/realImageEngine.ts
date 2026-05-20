import { imagePromptSet } from './imagePromptEngine';

type ImageNiche = 'trading' | 'photography' | 'beauty' | 'technology';

type GeneratedImages = {
  hero?: string;
  showcase?: string;
  mockup?: string;
  source: 'openai' | 'fallback';
  error?: string;
};

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
      size: '1536x1024',
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

export async function generateRealImages(niche: ImageNiche, sub = ''): Promise<GeneratedImages> {
  if (!process.env.OPENAI_API_KEY) {
    return { source: 'fallback' };
  }

  try {
    const prompts = imagePromptSet(niche, sub);

    const [hero, showcase] = await Promise.all([
      generateOpenAIImage(prompts.hero),
      generateOpenAIImage(prompts.showcase),
    ]);

    return {
      hero: hero || undefined,
      showcase: showcase || undefined,
      source: hero || showcase ? 'openai' : 'fallback',
    };
  } catch (error) {
    return {
      source: 'fallback',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

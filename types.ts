export enum Platform {
  LinkedIn = 'linkedin',
  Twitter = 'twitter',
  Instagram = 'instagram'
}

export enum Tone {
  Professional = 'Professional',
  Witty = 'Witty',
  Urgent = 'Urgent',
  Emotional = 'Emotional',
  Minimalist = 'Minimalist'
}

export interface PlatformContent {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  aspectRatio: '16:9' | '3:4' | '1:1';
  isImageLoading: boolean;
}

export interface GeneratedContent {
  [Platform.LinkedIn]: PlatformContent;
  [Platform.Twitter]: PlatformContent;
  [Platform.Instagram]: PlatformContent;
}

export type GenerationStatus = 'idle' | 'generating_text' | 'generating_images' | 'complete' | 'error';

export const TONE_LABELS: Record<Tone, string> = {
  [Tone.Professional]: '专业商务 (Professional)',
  [Tone.Witty]: '幽默风趣 (Witty)',
  [Tone.Urgent]: '紧迫感 (Urgent)',
  [Tone.Emotional]: '情感共鸣 (Emotional)',
  [Tone.Minimalist]: '极简主义 (Minimalist)',
};
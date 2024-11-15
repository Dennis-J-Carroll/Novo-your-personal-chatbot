export const EMOTIONS = ['happy', 'sad', 'neutral', 'excited', 'anxious', 'curious'] as const;
export const INTEREST_TOPICS = [
  'science',
  'technology',
  'nature',
  'art',
  'music',
  'philosophy',
  'space',
  'innovation'
] as const;

export type Emotion = typeof EMOTIONS[number];
export type Topic = typeof INTEREST_TOPICS[number];

export interface Conversation {
  input: string;
  response: string;
  emotion: Emotion;
  topic: Topic | 'general';
  feedback?: 'positive' | 'negative';
  timestamp: Date;
}

export interface PersonalityTrait {
  value: number;
  growth: number;
}
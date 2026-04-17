import type { Question } from './types';

export interface ToeicWord {
  id: number;
  word: string;
  reading: string; // 発音記号（IPA）
  meaning: string; // 日本語訳
  category: string; // business, grammar, travel, office, finance, it
  categoryLabel: string;
  level: number; // 600, 730, 860
  exampleSentence: string; // 例文（英語）
  exampleTranslation: string; // 例文の日本語訳
}

export interface ToeicQuestion extends Question {
  part: number; // 5=文法, 7=長文読解
  passage?: string; // Part 7の長文（Part 5は不要）
}

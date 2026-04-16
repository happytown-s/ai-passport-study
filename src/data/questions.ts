import type { Question } from './types';
import { aiBasicsQuestions } from './ai-basics';
import { mlBasicsQuestions } from './ml-basics';
import { generativeAiQuestions } from './generative-ai';
import { promptEngineeringQuestions } from './prompt-engineering';
import { aiRisksQuestions } from './ai-risks';
import { legalQuestions } from './legal';
import { businessQuestions } from './business';

export const allQuestions: Question[] = [
  ...aiBasicsQuestions,
  ...mlBasicsQuestions,
  ...generativeAiQuestions,
  ...promptEngineeringQuestions,
  ...aiRisksQuestions,
  ...legalQuestions,
  ...businessQuestions,
];

export const categories: { id: string; label: string; icon: string }[] = [
  { id: 'ai_basics', label: 'AI基礎知識', icon: '🧠' },
  { id: 'ml_basics', label: '機械学習基礎', icon: '📊' },
  { id: 'generative_ai', label: '生成AIの仕組み', icon: '🤖' },
  { id: 'prompt_engineering', label: 'プロンプトエンジニアリング', icon: '💬' },
  { id: 'ai_risks', label: 'AIのリスク・倫理', icon: '⚠️' },
  { id: 'legal', label: '著作権・法規制', icon: '⚖️' },
  { id: 'business', label: 'ビジネス活用', icon: '💼' },
];

import type { QuizConfig } from '../core/types';

export const quizConfig: QuizConfig = {
  id: 'ai-passport',
  title: '生成AIパスポート',
  description: '生成AIパスポート試験対策アプリ',
  passLine: 70,
  examQuestions: 60,
  examTimeLimit: 60,
  categories: [
    { id: 'ai_basics', name: 'AI基礎', label: 'AI基礎知識', icon: '🧠', file: () => import('./ai-basics').then(m => m.aiBasicsQuestions) },
    { id: 'ml_basics', name: 'ML基礎', label: '機械学習基礎', icon: '📊', file: () => import('./ml-basics').then(m => m.mlBasicsQuestions) },
    { id: 'generative_ai', name: '生成AI', label: '生成AIの仕組み', icon: '🤖', file: () => import('./generative-ai').then(m => m.generativeAiQuestions) },
    { id: 'prompt_engineering', name: 'PE', label: 'プロンプトエンジニアリング', icon: '💬', file: () => import('./prompt-engineering').then(m => m.promptEngineeringQuestions) },
    { id: 'ai_risks', name: 'リスク倫理', label: 'AIのリスク・倫理', icon: '⚠️', file: () => import('./ai-risks').then(m => m.aiRisksQuestions) },
    { id: 'legal', name: '法規制', label: '著作権・法規制', icon: '⚖️', file: () => import('./legal').then(m => m.legalQuestions) },
    { id: 'business', name: 'ビジネス', label: 'ビジネス活用', icon: '💼', file: () => import('./business').then(m => m.businessQuestions) },
  ],
  termsFile: () => import('./terms').then(m => m.terms),
};

export interface QuestionOption {
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  category: string;
  categoryLabel: string;
  question: string;
  options: QuestionOption[];
  explanation: string;
}

export interface AnswerRecord {
  questionId: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface ExamScore {
  totalQuestions: number;
  correctCount: number;
  date: string;
  timeSpent: number;
}

export type CategoryId = 'ai_basics' | 'ml_basics' | 'generative_ai' | 'prompt_engineering' | 'ai_risks' | 'legal' | 'business';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  icon: string;
}

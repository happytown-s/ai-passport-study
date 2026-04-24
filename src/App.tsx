import { useState, useCallback, useMemo } from 'react';
import type { Question, ExamScore } from './core/types';
import { allQuestions } from './data/questions';
import { quizConfig } from './data/config';
import { useStorage } from './core/useStorage';
import { pickFromCategories, shuffle } from './utils/helpers';

import HomePage from './pages/HomePage';
import DrillSelectPage from './pages/DrillSelectPage';
import DrillPlayPage from './pages/DrillPlayPage';
import ExamPage from './pages/ExamPage';
import ExamPlayPage from './pages/ExamPlayPage';
import ExamResultPage from './pages/ExamResultPage';
import ExamHistoryPage from './pages/ExamHistoryPage';
import ReviewPage from './pages/ReviewPage';
import TermsPage from './pages/TermsPage';
import TextbookSelect from './components/TextbookSelect';
import TextbookView from './components/TextbookView';
import textbookAiBasics from './data/textbook-ai-basics.json';
import textbookMlBasics from './data/textbook-ml-basics.json';
import textbookGenerativeAi from './data/textbook-generative-ai.json';
import textbookPromptEng from './data/textbook-prompt-engineering.json';
import textbookAiRisks from './data/textbook-ai-risks.json';
import textbookLegal from './data/textbook-legal.json';
import textbookBusiness from './data/textbook-business.json';

type Page =
  | 'home'
  | 'drill'
  | 'drill-play'
  | 'exam'
  | 'exam-play'
  | 'exam-result'
  | 'exam-history'
  | 'review'
  | 'review-play'
  | 'terms'
  | 'terms-drill'
  | 'textbook-select'
  | 'textbook-view';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [drillCategory, setDrillCategory] = useState<string | null>(null);
  const [textbookCategory, setTextbookCategory] = useState<string | null>(null);
  const [textbookQuestionIds, setTextbookQuestionIds] = useState<number[]>([]);
  const [textbookSearchKeyword, setTextbookSearchKeyword] = useState<string>('');

  const textbookMap: Record<string, { title: string; topics: typeof textbookAiBasics }> = {
    ai_basics: { title: 'AI基礎知識', topics: textbookAiBasics },
    ml_basics: { title: '機械学習基礎', topics: textbookMlBasics },
    generative_ai: { title: '生成AIの仕組み', topics: textbookGenerativeAi },
    prompt_engineering: { title: 'プロンプトエンジニアリング', topics: textbookPromptEng },
    ai_risks: { title: 'AIのリスク・倫理', topics: textbookAiRisks },
    legal: { title: '著作権・法規制', topics: textbookLegal },
    business: { title: 'ビジネス活用', topics: textbookBusiness },
  };
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examAnswers, setExamAnswers] = useState<Map<number, number>>(new Map());
  const [examTimeSpent, setExamTimeSpent] = useState(0);
  const [examStartKey, setExamStartKey] = useState(0);
  const [reviewQuestionIds, setReviewQuestionIds] = useState<number[]>([]);
  const [termsQuestionIds, setTermsQuestionIds] = useState<number[]>([]);

  const {
    answerHistory,
    examScores,
    streak,
    darkMode,
    recordAnswer,
    recordExamScore,
    toggleDarkMode,
    getWrongQuestions,
    clearHistory,
  } = useStorage();

  const wrongCount = useMemo(() => {
    return getWrongQuestions().length;
  }, [getWrongQuestions]);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  }, []);

  const drillQuestions = useMemo(() => {
    if (textbookQuestionIds.length > 0) {
      return allQuestions.filter((q) => textbookQuestionIds.includes(q.id));
    }
    if (!drillCategory) return allQuestions;
    return allQuestions.filter((q) => q.category === drillCategory);
  }, [drillCategory, textbookQuestionIds]);

  const handleSelectCategory = useCallback((catId: string | null) => {
    setDrillCategory(catId);
    navigate('drill-play');
  }, [navigate]);

  const handleStartExam = useCallback(() => {
    const perCategory = Math.ceil(quizConfig.examQuestions / quizConfig.categories.length);
    const questions = pickFromCategories(allQuestions, perCategory);
    setExamQuestions(questions.slice(0, quizConfig.examQuestions));
    setExamAnswers(new Map());
    setExamTimeSpent(0);
    setExamStartKey((k) => k + 1);
    navigate('exam-play');
  }, [navigate]);

  const handleExamFinish = useCallback(
    (answers: Map<number, number>, timeUsed: number) => {
      setExamAnswers(answers);
      setExamTimeSpent(timeUsed);

      let correctCount = 0;
      const wrongIds: number[] = [];
      const categoryScores: Record<string, { correct: number; total: number }> = {};

      for (const q of examQuestions) {
        if (!categoryScores[q.category]) categoryScores[q.category] = { correct: 0, total: 0 };
        categoryScores[q.category].total++;
        const userAnswer = answers.get(q.id);
        if (userAnswer !== undefined && q.options[userAnswer]?.correct) {
          correctCount++;
          categoryScores[q.category].correct++;
          recordAnswer(q.id, true);
        } else {
          wrongIds.push(q.id);
          recordAnswer(q.id, false);
        }
      }

      const score: ExamScore = {
        totalQuestions: examQuestions.length,
        correctCount,
        date: new Date().toISOString(),
        timeSpent: timeUsed,
        wrongIds,
        categoryScores,
      };
      recordExamScore(score);
      navigate('exam-result');
    },
    [examQuestions, recordAnswer, recordExamScore, navigate],
  );

  const handleRetryReview = useCallback((ids: number[]) => {
    setReviewQuestionIds(ids);
    navigate('review-play');
  }, [navigate]);

  const handleTermsDrill = useCallback((ids: number[]) => {
    setTermsQuestionIds(ids);
    navigate('terms-drill');
  }, [navigate]);

  const handleDrillFinish = useCallback(
    (_results: { correct: number; total: number }) => {
      // Results shown inline in DrillPlayPage, no navigation needed
    },
    [],
  );

  const startTime = useMemo(() => Date.now(), [examStartKey]);

  const handleExamSubmit = useCallback(
    (answers: Map<number, number>) => {
      const timeUsed = Math.floor((Date.now() - startTime) / 1000);
      handleExamFinish(answers, timeUsed);
    },
    [handleExamFinish, startTime],
  );

  const handleExamTimeUp = useCallback(
    (answers: Map<number, number>) => {
      const timeUsed = quizConfig.examTimeLimit * 60; // Full time expired
      handleExamFinish(answers, timeUsed);
    },
    [handleExamFinish],
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      {currentPage === 'home' && (
        <HomePage
          onNavigate={navigate}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          answerHistory={answerHistory}
          examScores={examScores}
          streak={streak}
          wrongCount={wrongCount}
        />
      )}

      {currentPage === 'drill' && (
        <DrillSelectPage
          allQuestions={allQuestions}
          answerHistory={answerHistory}
          onSelectCategory={handleSelectCategory}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'drill-play' && (
        <DrillPlayPage
          key={`drill-${drillCategory ?? 'all'}-${textbookQuestionIds.join(',')}`}
          questions={drillQuestions}
          categoryLabel={
            textbookQuestionIds.length > 0
              ? 'Textbook Practice'
              : drillCategory
              ? (allQuestions.find((q) => q.category === drillCategory)
                  ?.categoryLabel ?? drillCategory)
              : '全分野'
          }
          passLine={quizConfig.passLine}
          recordAnswer={recordAnswer}
          onFinish={handleDrillFinish}
          onBack={() => {
            setTextbookQuestionIds([]);
            if (textbookCategory) navigate('textbook-view');
            else navigate('drill');
          }}
        />
      )}

      {currentPage === 'exam' && (
        <ExamPage
          config={quizConfig}
          onStart={handleStartExam}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'exam-play' && (
        <ExamPlayPage
          key={examStartKey}
          questions={examQuestions}
          timeLimit={quizConfig.examTimeLimit}
          onTimeUp={handleExamTimeUp}
          onSubmit={handleExamSubmit}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'exam-result' && (
        <ExamResultPage
          questions={examQuestions}
          answers={examAnswers}
          timeSpent={examTimeSpent}
          passLine={quizConfig.passLine}
          onReview={() => {
            const wrongIds: number[] = [];
            for (const q of examQuestions) {
              const userAnswer = examAnswers.get(q.id);
              if (userAnswer === undefined || !q.options[userAnswer]?.correct) {
                wrongIds.push(q.id);
              }
            }
            setReviewQuestionIds(wrongIds);
            navigate('review-play');
          }}
          onRetry={handleStartExam}
          onHome={() => navigate('home')}
        />
      )}

      {currentPage === 'exam-history' && (
        <ExamHistoryPage
          examScores={examScores}
          onRetryWrong={(wrongIds) => {
            setReviewQuestionIds(wrongIds);
            navigate('review-play');
          }}
          onBack={() => navigate('home')}
          onClear={() => clearHistory()}
        />
      )}

      {currentPage === 'review' && (
        <ReviewPage
          allQuestions={allQuestions}
          wrongQuestionIds={getWrongQuestions()}
          onRetry={handleRetryReview}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'terms' && (
        <TermsPage
          onBack={() => {
            setTextbookSearchKeyword('');
            if (textbookCategory) navigate('textbook-view');
            else navigate('home');
          }}
          onStartDrill={handleTermsDrill}
          initialSearch={textbookSearchKeyword}
        />
      )}

      {currentPage === 'terms-drill' && (
        <DrillPlayPage
          key={`terms-${termsQuestionIds.join(',')}`}
          questions={
            termsQuestionIds.length > 0
              ? shuffle(
                  allQuestions.filter((q) => termsQuestionIds.includes(q.id)),
                )
              : []
          }
          categoryLabel="用語から出題"
          passLine={quizConfig.passLine}
          recordAnswer={recordAnswer}
          onFinish={handleDrillFinish}
          onBack={() => navigate('terms')}
        />
      )}

      {currentPage === 'review-play' && (
        <DrillPlayPage
          key={`review-${reviewQuestionIds.join(',')}`}
          questions={
            reviewQuestionIds.length > 0
              ? allQuestions.filter((q) => reviewQuestionIds.includes(q.id))
              : []
          }
          categoryLabel="復習"
          passLine={quizConfig.passLine}
          recordAnswer={recordAnswer}
          onFinish={handleDrillFinish}
          onBack={() => navigate('review')}
        />
      )}

      {currentPage === 'textbook-select' && (
        <TextbookSelect
          onSelect={(catId) => {
            setTextbookCategory(catId);
            navigate('textbook-view');
          }}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'textbook-view' && textbookCategory && textbookMap[textbookCategory] && (
        <TextbookView
          title={textbookMap[textbookCategory].title}
          category={textbookCategory}
          topics={textbookMap[textbookCategory].topics}
          onBack={() => navigate('textbook-select')}
          onPractice={(questionIds) => {
            setDrillCategory(null);
            setTextbookQuestionIds(questionIds);
            navigate('drill-play');
          }}
          onSearchKeyword={(keyword) => {
            setTextbookSearchKeyword(keyword);
            navigate('terms');
          }}
        />
      )}
    </div>
  );
}

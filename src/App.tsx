import { useState, useCallback, useMemo } from 'react';
import type { Question, ExamScore } from './data/types';
import { allQuestions } from './data/questions';
import { useStorage } from './hooks/useStorage';
import { pickFromCategories } from './utils/helpers';

import HomePage from './pages/HomePage';
import DrillSelectPage from './pages/DrillSelectPage';
import DrillPlayPage from './pages/DrillPlayPage';
import ExamPage from './pages/ExamPage';
import ExamPlayPage from './pages/ExamPlayPage';
import ExamResultPage from './pages/ExamResultPage';
import ReviewPage from './pages/ReviewPage';
import TermsPage from './pages/TermsPage';

type Page =
  | 'home'
  | 'drill'
  | 'drill-play'
  | 'exam'
  | 'exam-play'
  | 'exam-result'
  | 'review'
  | 'review-play'
  | 'terms';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [drillCategory, setDrillCategory] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examAnswers, setExamAnswers] = useState<Map<number, number>>(new Map());
  const [examTimeSpent, setExamTimeSpent] = useState(0);
  const [examStartKey, setExamStartKey] = useState(0);
  const [reviewQuestionIds, setReviewQuestionIds] = useState<number[]>([]);

  const {
    answerHistory,
    examScores,
    streak,
    darkMode,
    recordAnswer,
    recordExamScore,
    toggleDarkMode,
    getWrongQuestions,
  } = useStorage();

  const wrongCount = useMemo(() => {
    return getWrongQuestions().length;
  }, [getWrongQuestions]);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  }, []);

  const drillQuestions = useMemo(() => {
    if (!drillCategory) return allQuestions;
    return allQuestions.filter((q) => q.category === drillCategory);
  }, [drillCategory]);

  const handleSelectCategory = useCallback((catId: string | null) => {
    setDrillCategory(catId);
    navigate('drill-play');
  }, [navigate]);

  const handleStartExam = useCallback(() => {
    const questions = pickFromCategories(allQuestions, 9); // 7×9=63 → take 60
    setExamQuestions(questions.slice(0, 60));
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
      for (const q of examQuestions) {
        const userAnswer = answers.get(q.id);
        if (userAnswer !== undefined && q.options[userAnswer]?.correct) {
          correctCount++;
          recordAnswer(q.id, true);
        } else {
          recordAnswer(q.id, false);
        }
      }

      const score: ExamScore = {
        totalQuestions: examQuestions.length,
        correctCount,
        date: new Date().toISOString(),
        timeSpent: timeUsed,
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
      const timeUsed = 60 * 60; // Full time expired
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
          key={`drill-${drillCategory ?? 'all'}`}
          questions={drillQuestions}
          categoryLabel={
            drillCategory
              ? (allQuestions.find((q) => q.category === drillCategory)
                  ?.categoryLabel ?? drillCategory)
              : '全分野'
          }
          recordAnswer={recordAnswer}
          onFinish={handleDrillFinish}
          onBack={() => navigate('drill')}
        />
      )}

      {currentPage === 'exam' && (
        <ExamPage
          onStart={handleStartExam}
          onBack={() => navigate('home')}
        />
      )}

      {currentPage === 'exam-play' && (
        <ExamPlayPage
          key={examStartKey}
          questions={examQuestions}
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
          onBack={() => navigate('home')}
          onStartDrillFromTerm={(ids) => {
            setReviewQuestionIds(ids);
            navigate('review-play');
          }}
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
          recordAnswer={recordAnswer}
          onFinish={handleDrillFinish}
          onBack={() => navigate('review')}
        />
      )}
    </div>
  );
}

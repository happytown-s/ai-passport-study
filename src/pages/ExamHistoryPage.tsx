import { useMemo } from 'react';
import type { ExamScore } from '../core/types';
import { categories } from '../data/questions';

interface Props {
  examScores: ExamScore[];
  onRetryWrong: (wrongIds: number[]) => void;
  onBack: () => void;
  onClear: () => void;
}

export default function ExamHistoryPage({ examScores, onRetryWrong, onBack, onClear }: Props) {
  const sorted = useMemo(
    () => [...examScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [examScores],
  );

  const avgScore = useMemo(() => {
    if (sorted.length === 0) return 0;
    const sum = sorted.reduce((s, e) => s + Math.round((e.correctCount / e.totalQuestions) * 100), 0);
    return Math.round(sum / sorted.length);
  }, [sorted]);

  const bestScore = useMemo(() => {
    if (sorted.length === 0) return 0;
    return Math.max(...sorted.map(e => Math.round((e.correctCount / e.totalQuestions) * 100)));
  }, [sorted]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-3 py-1.5 -ml-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            &larr; Back
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
            Exam History
          </h1>
          {sorted.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Delete all exam history?')) onClear();
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No exam history yet. Take a mock exam to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sorted.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Exams</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold ${avgScore >= 70 ? 'text-green-500' : 'text-amber-500'}`}>
                  {avgScore}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Average Score</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold ${bestScore >= 70 ? 'text-green-500' : 'text-amber-500'}`}>
                  {bestScore}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Best Score</p>
              </div>
            </div>

            {/* Score trend */}
            {sorted.length >= 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Score Trend</h3>
                <div className="flex items-end gap-1 h-20">
                  {sorted.slice(0, 20).reverse().map((score, i) => {
                    const rate = Math.round((score.correctCount / score.totalQuestions) * 100);
                    const height = Math.max(8, (rate / 100) * 64);
                    const color = rate >= 70 ? 'bg-green-400' : rate >= 50 ? 'bg-amber-400' : 'bg-red-400';
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${color} transition-all`}
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-[10px] text-gray-400">{rate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History list */}
            <div className="space-y-3">
              {sorted.map((score, idx) => {
                const rate = Math.round((score.correctCount / score.totalQuestions) * 100);
                const passed = rate >= 70;
                const date = new Date(score.date);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                const minutes = Math.floor(score.timeSpent / 60);
                const seconds = score.timeSpent % 60;

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${passed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                            {passed ? 'PASS' : 'FAIL'}
                          </span>
                          <span className="text-xs text-gray-400">{dateStr}</span>
                        </div>
                        <span className={`text-lg font-bold ${passed ? 'text-green-500' : 'text-amber-500'}`}>
                          {rate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{score.correctCount}/{score.totalQuestions}</span>
                        <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                        {(score.wrongIds && score.wrongIds.length > 0) && (
                          <span className="text-red-400">{score.wrongIds.length} wrong</span>
                        )}
                      </div>

                      {/* Category breakdown */}
                      {score.categoryScores && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(score.categoryScores).map(([catId, stats]) => {
                            const cat = categories.find(c => c.id === catId);
                            const catRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                            const barColor = catRate >= 80 ? 'bg-green-400' : catRate >= 60 ? 'bg-amber-400' : 'bg-red-400';
                            return (
                              <div key={catId} className="flex items-center gap-2">
                                <span className="text-xs w-20 truncate text-gray-500 dark:text-gray-400">{cat?.label ?? catId}</span>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                  <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${catRate}%` }} />
                                </div>
                                <span className="text-xs text-gray-400 w-8 text-right">{catRate}%</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Retry wrong button */}
                    {score.wrongIds && score.wrongIds.length > 0 && (
                      <button
                        onClick={() => onRetryWrong(score.wrongIds!)}
                        className="w-full py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border-t border-amber-100 dark:border-amber-900/30"
                      >
                        Review {score.wrongIds.length} wrong answers
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

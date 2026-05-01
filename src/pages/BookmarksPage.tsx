import { useState, useEffect, useCallback } from 'react';
import type { Question } from '../core/types';
import { allQuestions } from '../data/questions';
import { getBookmarks, toggleBookmark } from '../utils/storage';

interface Props {
  onBack: () => void;
  onNavigate: (page: string, options?: Record<string, unknown>) => void;
}

export default function BookmarksPage({ onBack, onNavigate }: Props) {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  const reload = useCallback(() => {
    setBookmarkIds(getBookmarks());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleRemove = (id: number) => {
    toggleBookmark(id);
    reload();
  };

  const bookmarkedQuestions = bookmarkIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm"
        >
          ← ホームに戻る
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ⭐️ ブックマーク
        </h2>

        {bookmarkedQuestions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📌</div>
            <p className="text-gray-500 dark:text-gray-400">
              まだブックマークされた問題がありません
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              ドリルモードで⭐️ボタンを押して問題を保存しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {bookmarkedQuestions.length}問ブックマーク中
            </p>
            {bookmarkedQuestions.map((q) => (
              <BookmarkItem key={q.id} question={q} onRemove={handleRemove} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarkItem({
  question,
  onRemove,
  onNavigate,
}: {
  question: Question;
  onRemove: (id: number) => void;
  onNavigate: (page: string, options?: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const truncatedQuestion =
    question.question.length > 60
      ? question.question.slice(0, 60) + '…'
      : question.question;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition-colors">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onRemove(question.id)}
          className="mt-0.5 text-yellow-400 hover:text-yellow-500 text-xl flex-shrink-0"
          title="ブックマーク解除"
        >
          ★
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-white font-medium text-sm leading-snug">
            {truncatedQuestion}
          </p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
            {question.categoryLabel}
          </span>
        </div>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-xs text-violet-600 dark:text-violet-400 hover:underline"
      >
        {expanded ? '閉じる ▲' : '正解・解説を見る ▼'}
      </button>

      {expanded && (
        <div className="mt-3 pl-8 border-l-2 border-violet-200 dark:border-violet-700 space-y-2">
          <div className="space-y-1">
            {question.options.map((opt, i) => (
              <p
                key={i}
                className={`text-sm ${
                  opt.correct
                    ? 'text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                }`
              }
              >
                {String.fromCharCode(65 + i)}. {opt.text}
                {opt.correct && ' ✓'}
              </p>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {question.explanation}
          </p>
          {question.keyVocabulary && question.keyVocabulary.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1.5">
                📖 単語帳
              </p>
              <div className="flex flex-wrap gap-1.5">
                {question.keyVocabulary.map((v: { word: string; meaning: string }, i: number) => (
                  <button
                    key={i}
                    onClick={() => onNavigate('terms', { initialSearch: v.word })}
                    className="text-xs px-2 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                  >
                    {v.word}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => onNavigate('textbook-view', { category: question.category })}
            className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            📚 {question.categoryLabel}のテキストを読む →
          </button>
        </div>
      )}
    </div>
  );
}

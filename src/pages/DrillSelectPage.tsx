import { useState } from 'react';
import { categories } from '../data/questions';
import { getCategoryProgress } from '../utils/helpers';
import type { Question, AnswerRecord } from '../core/types';

interface Props {
  allQuestions: Question[];
  answerHistory: AnswerRecord[];
  onSelectCategory: (categoryId: string | null) => void;
  onBack: () => void;
  isPremium: boolean;
  isDevMode: boolean;
  freeCategoryIds: string[];
  onOpenSettings: () => void;
}

export default function DrillSelectPage({
  allQuestions,
  answerHistory,
  onSelectCategory,
  onBack,
  isPremium,
  isDevMode,
  freeCategoryIds,
  onOpenSettings,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const isUnlocked = isPremium || isDevMode;
  const isLocked = (catId: string | null) => {
    if (isUnlocked) return false;
    if (catId === null) return true; // 全分野 is locked for free users
    return !freeCategoryIds.includes(catId);
  };

  const handleClick = (catId: string | null) => {
    if (isLocked(catId)) {
      setShowModal(true);
      return;
    }
    onSelectCategory(catId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm"
        >
          ← ホームに戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📝 分野を選択
        </h1>

        <button
          onClick={() => handleClick(null)}
          className={`w-full rounded-xl shadow-lg p-6 text-left mb-4 transition-transform ${
            isLocked(null)
              ? 'bg-gray-300 dark:bg-gray-700 opacity-80'
              : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{isLocked(null) ? '🔒' : '📚'}</div>
            <div>
              <h2 className="text-lg font-bold">
                全分野 {isLocked(null) ? '🔒' : ''}
              </h2>
              <p className={`text-sm ${isLocked(null) ? 'text-gray-500 dark:text-gray-400' : 'text-violet-200'}`}>
                全{allQuestions.length}問からランダム出題
              </p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const progress = getCategoryProgress(cat.id, answerHistory, allQuestions);
            const locked = isLocked(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-left transition-transform ${
                  locked ? 'opacity-70' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{locked ? '🔒' : cat.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      {cat.label}
                      {locked && (
                        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 font-normal">
                          無料会員
                        </span>
                      )}
                    </h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progress}%</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lock Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mx-4 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
              🔒 有料会員が必要です
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
              このコンテンツを利用するには有料会員への登録が必要です。
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  onOpenSettings();
                }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold hover:scale-[1.02] transition-transform"
              >
                👑 有料会員になる
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

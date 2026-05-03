import { useRef, useState } from 'react';

interface TextbookSelectProps {
  onSelect: (categoryId: string) => void;
  onBack: () => void;
  isPremium: boolean;
  isDevMode: boolean;
  freeCategoryIds: string[];
  onOpenSettings: () => void;
}

const categories = [
  { id: 'ai_basics', name: 'AI基礎知識', icon: '[AI]', count: 14, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { id: 'ml_basics', name: '機械学習基礎', icon: '[ML]', count: 10, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { id: 'generative_ai', name: '生成AIの仕組み', icon: '[GA]', count: 15, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { id: 'prompt_engineering', name: 'プロンプトエンジニアリング', icon: '[PE]', count: 10, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { id: 'ai_risks', name: 'AIのリスク・倫理', icon: '[RS]', count: 13, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { id: 'legal', name: '著作権・法規制', icon: '[LG]', count: 13, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
  { id: 'business', name: 'ビジネス活用', icon: '[BS]', count: 12, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
];

export default function TextbookSelect({ onSelect, onBack, isPremium, isDevMode, freeCategoryIds, onOpenSettings }: TextbookSelectProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const isUnlocked = isPremium || isDevMode;

  const isLocked = (catId: string) => {
    if (isUnlocked) return false;
    return !freeCategoryIds.includes(catId);
  };

  const handleClick = (catId: string) => {
    if (isLocked(catId)) {
      setShowModal(true);
      return;
    }
    onSelect(catId);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5 && dx > 0) {
      onBack();
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
          >
            戻る
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Textbook
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select a category to study with how-to guides, keywords, and exam tips.
          合計 {categories.reduce((s, c) => s + c.count, 0)} トピック
        </p>

        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat) => {
            const locked = isLocked(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all text-left ${
                  locked
                    ? 'border-gray-200 dark:border-gray-700 opacity-70'
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${cat.color}`}
                >
                  {locked ? '🔒' : cat.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cat.count} トピック{locked ? ' • 有料会員限定' : ''}
                  </p>
                </div>
                <span className="text-gray-300 dark:text-gray-600">
                  &gt;
                </span>
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
              このテキストを利用するには有料会員への登録が必要です。
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

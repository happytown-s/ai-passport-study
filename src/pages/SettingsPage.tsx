interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isPremium: boolean;
  isDevMode: boolean;
  isUnlocked: boolean;
  setDevMode: (mode: boolean) => void;
  purchasePremium: () => void;
  restorePurchase: () => void;
  onBack: () => void;
}

export default function SettingsPage({
  darkMode,
  onToggleDarkMode,
  isPremium,
  isDevMode,
  isUnlocked,
  setDevMode,
  purchasePremium,
  restorePurchase,
  onBack,
}: Props) {
  const getMemberStatus = () => {
    if (isDevMode) return '👑 開発者モード (全機能アンロック)';
    if (isPremium) return '👑 有料会員';
    return '📎 無料会員 (2カテゴリのみ)';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm"
        >
          ← 戻る
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ⚙️ 設定
        </h1>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">ダークモード</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  画面のテーマを切り替えます
                </p>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-violet-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dev Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  🔧 Dev Mode
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  開発者用 — 全機能をアンロックします
                </p>
              </div>
              <button
                onClick={() => setDevMode(!isDevMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDevMode ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isDevMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Member Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-2">
              会員ステータス
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {getMemberStatus()}
            </p>
            {!isUnlocked && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                AI基礎・生成AI は無料で利用できます
              </p>
            )}
          </div>

          {/* Purchase / Restore */}
          {!isPremium && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3">
              <button
                onClick={purchasePremium}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-lg font-bold hover:scale-[1.02] transition-transform"
              >
                👑 有料会員になる
              </button>
              <button
                onClick={restorePurchase}
                className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                購入を復元
              </button>
            </div>
          )}

          {isPremium && !isDevMode && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-3">
              <button
                onClick={restorePurchase}
                className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                購入を復元
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

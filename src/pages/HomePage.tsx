import { quizConfig } from '../data/config';
import StatsSummary from '../components/StatsSummary';
import SettingsButton from '../components/SettingsButton';

interface Props {
  onNavigate: (page: string) => void;

  answerHistory: { questionId: number; isCorrect: boolean; timestamp: number }[];
  examScores: { totalQuestions: number; correctCount: number; date: string; timeSpent: number }[];
  streak: number;
  wrongCount: number;
  onOpenSettings: () => void;
}

export default function HomePage({
  onNavigate,
  answerHistory,
  examScores,
  streak,
  wrongCount,
  onOpenSettings,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SettingsButton onClick={onOpenSettings} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {quizConfig.title}Study
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {quizConfig.description}
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <StatsSummary
            answerHistory={answerHistory}
            examScores={examScores}
            streak={streak}
            wrongCount={wrongCount}
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate('drill')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📝</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  ドリルモード
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  分野別に練習問題を解く
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('exam')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  模試モード
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {quizConfig.examQuestions}問・{quizConfig.examTimeLimit}分の本番シミュレーション
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('exam-history')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  Exam History
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Score trend & weak point analysis
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('review')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔄</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  復習モード
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  間違えた問題を再挑戦
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">⭐️</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                  ブックマーク
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  お気に入りの問題を確認
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('terms')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📖</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  用語集
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  重要用語をチェック・関連問題にジャンプ
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('textbook-select')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                TB
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  Textbook
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  7カテゴリ / 70トピック — How-toガイドと試験対策TIPSで学習
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <p className="max-w-2xl mx-auto px-4 mt-8 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        本サイトは非公式の試験対策問題集です。「生成AIパスポート」は一般社団法人生成AI活用普及協会（GUGA）の登録商標です。
      </p>
    </div>
  );
}

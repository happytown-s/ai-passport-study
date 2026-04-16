import type { Question } from '../data/types';

interface Props {
  question: Question;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
  answered: boolean;
}

export default function QuizCard({ question, selectedAnswer, onAnswer, answered }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="mb-2 text-xs font-medium text-violet-600 dark:text-violet-400">
        {question.categoryLabel}
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Q{question.id}. {question.question}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let btnClass =
            'w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ';
          if (answered) {
            if (opt.correct) {
              btnClass +=
                'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            } else if (selectedAnswer === i) {
              btnClass +=
                'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            } else {
              btnClass += 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-500';
            }
          } else if (selectedAnswer === i) {
            btnClass +=
              'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200';
          } else {
            btnClass +=
              'border-gray-200 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-400 cursor-pointer text-gray-800 dark:text-gray-200';
          }
          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
              className={btnClass}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.text}
              {answered && opt.correct && (
                <span className="ml-2">✅</span>
              )}
              {answered && selectedAnswer === i && !opt.correct && (
                <span className="ml-2">❌</span>
              )}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
            💡 解説
          </p>
          <p className="text-sm text-indigo-700 dark:text-indigo-400">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

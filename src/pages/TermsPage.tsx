import { useState, useMemo } from 'react';
import { terms, type Term } from '../data/terms';
import { categories } from '../data/questions';

interface Props {
  onBack: () => void;
  onStartDrillFromTerm: (questionIds: number[]) => void;
}

export default function TermsPage({ onBack, onStartDrillFromTerm }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTermId, setExpandedTermId] = useState<number | null>(null);

  const filteredTerms = useMemo(() => {
    let result = terms;
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.reading.includes(q) ||
          t.definition.toLowerCase().includes(q),
      );
    }
    return result;
  }, [search, selectedCategory]);

  const getRelatedTerms = (term: Term) => {
    return terms.filter((t) => term.relatedTermIds.includes(t.id));
  };

  const getCategoryInfo = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 flex items-center gap-1 transition-colors"
          >
            <span>←</span> ホーム
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            📖 用語集
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            生成AIパスポートの重要用語 {terms.length}語
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="用語や読み方で検索..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            全分野
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          {filteredTerms.length} / {terms.length} 件
        </p>

        {/* Terms list */}
        <div className="space-y-2">
          {filteredTerms.map((term) => {
            const catInfo = getCategoryInfo(term.category);
            const isExpanded = expandedTermId === term.id;
            const relatedTerms = getRelatedTerms(term);
            const relatedQuestions = term.relatedQuestionIds;

            return (
              <div
                key={term.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
              >
                <button
                  onClick={() =>
                    setExpandedTermId(isExpanded ? null : term.id)
                  }
                  className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {term.term}
                      </span>
                      {catInfo && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 whitespace-nowrap">
                          {catInfo.icon} {catInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                      {term.reading}
                    </p>
                  </div>
                  <span
                    className={`text-gray-400 transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {term.definition}
                    </p>

                    {/* Related terms */}
                    {relatedTerms.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          関連用語
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedTerms.map((rt) => (
                            <button
                              key={rt.id}
                              onClick={() => setExpandedTermId(rt.id)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                            >
                              {rt.term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related questions */}
                    {relatedQuestions.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          関連問題
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedQuestions.map((qId) => (
                            <button
                              key={qId}
                              onClick={() => onStartDrillFromTerm([qId])}
                              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                              title={`問題 ${qId} でドリル開始`}
                            >
                              Q{qId}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              onStartDrillFromTerm(relatedQuestions)
                            }
                            className="text-xs px-2.5 py-1 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                            title={`関連問題 ${relatedQuestions.length}問でドリル開始`}
                          >
                            全部解く ({relatedQuestions.length}問)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500">
              該当する用語が見つかりませんでした
            </p>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}

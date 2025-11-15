import { CorrectResult } from '@/lib/api/correctResult';

type FilterType = 'all' | 'essay' | 'fill' | 'choice' | 'translate';

interface FilterButtonsProps {
  correctResults: CorrectResult[];
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterButtons({
  correctResults,
  selectedFilter,
  onFilterChange
}: FilterButtonsProps) {
  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      essay: 'エッセイ',
      fill: '穴埋め',
      choice: '選択',
      translate: '翻訳'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // 問題タイプ別の統計
  const typeStats = {
    essay: correctResults.filter(r => r.question_template_master.question_type === 'essay'),
    fill: correctResults.filter(r => r.question_template_master.question_type === 'fill'),
    choice: correctResults.filter(r => r.question_template_master.question_type === 'choice'),
    translate: correctResults.filter(r => r.question_template_master.question_type === 'translate'),
  };

  const totalQuestions = correctResults.length;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          すべて ({totalQuestions})
        </button>
        {Object.entries(typeStats).map(([type, results]) => (
          results.length > 0 && (
            <button
              key={type}
              onClick={() => onFilterChange(type as FilterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {getQuestionTypeLabel(type)} ({results.length})
            </button>
          )
        ))}
      </div>
    </div>
  );
}

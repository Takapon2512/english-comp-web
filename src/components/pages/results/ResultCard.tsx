import { CorrectResult } from '@/lib/api/correctResult';
import { useState } from 'react';

interface ResultCardProps {
  result: CorrectResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      essay: 'エッセイ',
      fill: '穴埋め',
      choice: '選択',
      translate: '翻訳'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'basic': return '初級';
      case 'inter': return '中級';
      case 'adv': return '上級';
      default: return level;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 border border-green-200';
    if (score >= 70) return 'bg-blue-50 border border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border border-yellow-200';
    return 'bg-red-50 border border-red-200';
  };

  const getLevelBadgeColor = (level: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700',
      inter: 'bg-blue-100 text-blue-700',
      adv: 'bg-blue-200 text-blue-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* カードヘッダー */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(result.question_template_master.level)}`}>
              {getLevelLabel(result.question_template_master.level)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {getQuestionTypeLabel(result.question_template_master.question_type)}
            </span>
            <span className="text-xs text-gray-500">
              {result.question_template_master.category.name}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(result.correct_rate)} ${getScoreBadgeColor(result.correct_rate)}`}>
            {result.correct_rate}%
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 問題文 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">問題</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 mb-2">{result.question_template_master.english}</p>
            <p className="text-sm text-gray-600">{result.question_template_master.japanese}</p>
          </div>
        </div>

        {/* 展開/折りたたみボタン */}
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">
              {isExpanded ? '詳細を閉じる' : '詳細を表示'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 折りたたみ可能なコンテンツ */}
        {isExpanded && (
          <div className="space-y-6 mb-6">
            {/* あなたの解答 */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">あなたの解答</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{result.question_answer.user_answer}</p>
              </div>
            </div>

            {/* 模範解答 */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">模範解答</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{result.example_correction}</p>
              </div>
            </div>

            {/* 添削コメント */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">添削コメント</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">{result.advice}</p>
              </div>
            </div>
          </div>
        )}

        {/* スコア詳細 */}
        <div className="flex items-center justify-between pt-4 border-gray-300 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>獲得ポイント: <strong className="text-blue-600">{result.get_points}</strong> / {result.question_template_master.points}</span>
            <span>挑戦回数: {result.challenge_count}回</span>
            <span>推定時間: {result.question_template_master.estimated_time}分</span>
          </div>
        </div>
      </div>
    </div>
  );
}

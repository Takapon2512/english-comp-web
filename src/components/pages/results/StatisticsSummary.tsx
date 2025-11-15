interface StatisticsSummaryProps {
  totalQuestions: number;
  averageScore: number;
  totalPoints: number;
  maxPoints: number;
}

export function StatisticsSummary({
  totalQuestions,
  averageScore,
  totalPoints,
  maxPoints
}: StatisticsSummaryProps) {
  // 平均正答率の色を決定
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  // 獲得ポイントの色を決定（達成率に基づく）
  const getPointsColor = (points: number, maxPoints: number) => {
    if (maxPoints === 0) return 'text-gray-600';
    const rate = (points / maxPoints) * 100;
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-blue-500';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500 mb-1">総問題数</div>
        <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500 mb-1">平均正答率</div>
        <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500 mb-1">獲得ポイント</div>
        <div className="flex items-end gap-2">
          <div className={`text-2xl font-bold ${getPointsColor(totalPoints, maxPoints)}`}>{totalPoints}</div>
          <div className="text-sm text-gray-500 mb-0.5">/ {maxPoints}</div>
        </div>
      </div>
    </div>
  );
}

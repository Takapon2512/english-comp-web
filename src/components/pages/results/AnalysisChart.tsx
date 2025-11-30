'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Chart.jsを動的インポートでクライアントサイドのみで読み込み
const DynamicRadar = dynamic(
  () => import('./RadarChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-80">
        <div className="text-gray-500">チャートを読み込み中...</div>
      </div>
    )
  }
);

interface AnalysisChartProps {
  grammarScore: number;
  vocabularyScore: number;
  expressionScore: number;
  structureScore: number;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({
  grammarScore,
  vocabularyScore,
  expressionScore,
  structureScore,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">詳細分析スコア</h2>
      <div className="relative h-80">
        <DynamicRadar
          grammarScore={grammarScore}
          vocabularyScore={vocabularyScore}
          expressionScore={expressionScore}
          structureScore={structureScore}
        />
      </div>
      
      {/* スコア詳細 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 mb-1">{grammarScore}</div>
          <div className="text-sm text-gray-600">文法</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 mb-1">{vocabularyScore}</div>
          <div className="text-sm text-gray-600">語彙</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 mb-1">{expressionScore}</div>
          <div className="text-sm text-gray-600">表現</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 mb-1">{structureScore}</div>
          <div className="text-sm text-gray-600">構成</div>
        </div>
      </div>
    </div>
  );
};

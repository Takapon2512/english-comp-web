'use client';

import { useAuth } from '@/hooks/useAuth';
import { FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { getProject, Project } from '@/lib/api/project';
import { getCorrectResults, CorrectResult } from '@/lib/api/correctResult';
import { useParams } from 'next/navigation';
import { 
  StatisticsSummary, 
  FilterButtons, 
  ResultCard, 
  LoadingSpinner, 
  EmptyState 
} from '@/components/pages/results';
import Link from 'next/link';

export default function ResultDetailPage() {
  const { isLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [correctResults, setCorrectResults] = useState<CorrectResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'essay' | 'fill' | 'choice' | 'translate'>('all');

  const params = useParams();
  const projectId = params.id as string;

  // プロジェクト情報を取得
  const fetchProject = useCallback(async () => {
    try {
      setError(null);
      const response = await getProject(projectId);
      setProject(response.project);
    } catch (error) {
      console.error('プロジェクト情報の取得に失敗しました:', error);
      setError('プロジェクト情報の取得に失敗しました');
    }
  }, [projectId]);

  // 添削結果を取得
  const fetchCorrectResults = useCallback(async () => {
    try {
      setResultsLoading(true);
      setError(null);
      const response = await getCorrectResults({ project_id: projectId });
      setCorrectResults(response.correct_results);
    } catch (error) {
      console.error('添削結果の取得に失敗しました:', error);
      setError('添削結果の取得に失敗しました');
    } finally {
      setResultsLoading(false);
    }
  }, [projectId]);

  // 認証完了後にデータを取得
  useEffect(() => {
    if (!isLoading && projectId) {
      fetchProject();
      fetchCorrectResults();
    }
  }, [isLoading, projectId, fetchProject, fetchCorrectResults]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={false}
      text="学習結果を読み込み中..."
      overlay={true}
    />;
  }

  // フィルタリングされた結果
  const filteredResults = correctResults.filter(result => 
    selectedFilter === 'all' || result.question_template_master.question_type === selectedFilter
  );

  // 統計データの計算
  const totalQuestions = correctResults.length;
  const averageScore = totalQuestions > 0 
    ? Math.round(correctResults.reduce((sum, result) => sum + result.correct_rate, 0) / totalQuestions)
    : 0;
  const totalPoints = correctResults.reduce((sum, result) => sum + result.get_points, 0);
  const maxPoints = correctResults.reduce((sum, result) => sum + result.question_template_master.points, 0);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">学習結果詳細</h1>
                <p className="text-gray-600">
                  {project?.name}の学習結果を確認しましょう
                </p>
              </div>
            </div>
            <Link
              href="/results"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900 hover:underline"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              結果一覧に戻る
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 統計サマリー */}
          {!resultsLoading && correctResults.length > 0 && (
            <StatisticsSummary
              totalQuestions={totalQuestions}
              averageScore={averageScore}
              totalPoints={totalPoints}
              maxPoints={maxPoints}
            />
          )}

          {/* フィルター */}
          {!resultsLoading && correctResults.length > 0 && (
            <FilterButtons
              correctResults={correctResults}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          )}

          {/* 添削結果一覧 */}
          {resultsLoading ? (
            <LoadingSpinner text="添削結果を読み込み中..." />
          ) : filteredResults.length > 0 ? (
            <div className="space-y-6">
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
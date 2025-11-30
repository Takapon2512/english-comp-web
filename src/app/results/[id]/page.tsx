'use client';

import { useAuth } from '@/hooks/useAuth';
import { FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { getProject, Project } from '@/lib/api/project';
import { getCorrectResults, CorrectResult } from '@/lib/api/correctResult';
import { getWeaknessAnalysis, WeaknessAnalysisResponse } from '@/lib/api/analysis';
import { useParams } from 'next/navigation';
import { 
  LoadingSpinner, 
  EmptyState,
  AnalysisChart
} from '@/components/pages/results';
import Link from 'next/link';

export default function ResultDetailPage() {
  const { isLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [correctResults, setCorrectResults] = useState<CorrectResult[]>([]);
  const [weaknessAnalysis, setWeaknessAnalysis] = useState<WeaknessAnalysisResponse | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 弱点分析結果を取得
  const fetchWeaknessAnalysis = useCallback(async () => {
    try {
      setAnalysisLoading(true);
      setError(null);
      const response = await getWeaknessAnalysis(projectId);
      setWeaknessAnalysis(response);
    } catch (error) {
      console.error('弱点分析の取得に失敗しました:', error);
      setError('弱点分析の取得に失敗しました');
    } finally {
      setAnalysisLoading(false);
    }
  }, [projectId]);

  // 認証完了後にデータを取得
  useEffect(() => {
    if (!isLoading && projectId) {
      fetchProject();
      fetchCorrectResults();
      fetchWeaknessAnalysis();
    }
  }, [isLoading, projectId, fetchProject, fetchCorrectResults, fetchWeaknessAnalysis]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={false}
      text="学習結果を読み込み中..."
      overlay={true}
    />;
  }

  // 統計データの計算
  const totalPoints = correctResults.reduce((sum, result) => sum + result.get_points, 0);
  const maxPoints = correctResults.reduce((sum, result) => sum + result.question_template_master.points, 0);
  
  // 弱点分析からの統計データ
  const overallScore = weaknessAnalysis?.weakness_analysis_summary.overall_score || 0;

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
          {!analysisLoading && !resultsLoading && weaknessAnalysis && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">学習成果サマリー</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">総合スコア</p>
                      <p className="text-2xl font-semibold text-gray-900">{overallScore}点</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">得点率</p>
                      <p className="text-2xl font-semibold text-gray-900">{maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 弱点分析ダッシュボード */}
          {!analysisLoading && weaknessAnalysis && (
            <div className="space-y-8">
              {/* 詳細分析スコア */}
              <AnalysisChart
                grammarScore={weaknessAnalysis.weakness_detailed_analysis_summary.grammar_score}
                vocabularyScore={weaknessAnalysis.weakness_detailed_analysis_summary.vocabulary_score}
                expressionScore={weaknessAnalysis.weakness_detailed_analysis_summary.expression_score}
                structureScore={weaknessAnalysis.weakness_detailed_analysis_summary.structure_score}
              />

              {/* カテゴリ別分析 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">カテゴリ別分析</h2>
                <div className="space-y-6">
                  {weaknessAnalysis.weakness_category_analysis_summary.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{category.category_name}</h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                            category.is_strength 
                              ? 'bg-slate-200 text-slate-800' 
                              : category.is_weakness 
                                ? 'bg-slate-400 text-white' 
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {category.is_strength ? '強み' : category.is_weakness ? '弱点' : '普通'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">{category.score}</span>
                          <span className="text-sm text-gray-500 ml-1">点</span>
                        </div>
                      </div>
                      
                      {category.strengths.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">強み</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {category.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {category.issues.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-800 mb-2">課題</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {category.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {category.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">例</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {category.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 学習アドバイス */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">パーソナライズされた学習アドバイス</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">学習アドバイス</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {weaknessAnalysis.weakness_learning_advice_summary.learning_advice}
                    </p>
                  </div>
                  
                  {weaknessAnalysis.weakness_learning_advice_summary.recommended_actions && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">推奨アクション</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {JSON.parse(weaknessAnalysis.weakness_learning_advice_summary.recommended_actions).map((action: string, index: number) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {weaknessAnalysis.weakness_learning_advice_summary.next_goals && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">次の目標</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {JSON.parse(weaknessAnalysis.weakness_learning_advice_summary.next_goals).map((goal: string, index: number) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">学習プラン</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {weaknessAnalysis.weakness_learning_advice_summary.study_plan}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">応援メッセージ</h3>
                    <p className="text-slate-800 leading-relaxed">
                      {weaknessAnalysis.weakness_learning_advice_summary.motivational_message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ローディング状態 */}
          {(analysisLoading || resultsLoading) && (
            <LoadingSpinner text="分析結果を読み込み中..." />
          )}

          {/* エラー状態またはデータなし */}
          {!analysisLoading && !resultsLoading && !weaknessAnalysis && (
            <EmptyState />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
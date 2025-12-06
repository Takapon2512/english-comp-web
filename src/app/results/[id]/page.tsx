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
import dynamic from 'next/dynamic';

// PieChartを動的インポートでクライアントサイドのみで読み込み
const DynamicPieChart = dynamic(
  () => import('@/components/pages/results/PieChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-20 h-20 bg-gray-100 rounded-full animate-pulse"></div>
    )
  }
);

export default function ResultDetailPage() {
  const { isLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [correctResults, setCorrectResults] = useState<CorrectResult[]>([]);
  const [weaknessAnalysis, setWeaknessAnalysis] = useState<WeaknessAnalysisResponse | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commentary' | 'correction'>('commentary');

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

  // カテゴリ別分析結果をスコアの低い順にソート
  const sortedCategoryAnalysisSummary = weaknessAnalysis?.weakness_category_analysis_summary.sort((a, b) => a.score - b.score) || [];

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

          {/* 学習成果サマリー */}
          {!analysisLoading && !resultsLoading && weaknessAnalysis && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">学習成果サマリー</h2>
              
              {/* 基本統計 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <DynamicPieChart
                        score={overallScore}
                        maxScore={100}
                        title="総合スコア"
                        color="#3b82f6"
                      />
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
                      <DynamicPieChart
                        score={maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0}
                        maxScore={100}
                        title="得点率"
                        color="#10b981"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">得点率</p>
                      <p className="text-2xl font-semibold text-gray-900">{maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 詳細分析スコア */}
              <AnalysisChart
                grammarScore={weaknessAnalysis.weakness_detailed_analysis_summary.grammar_score}
                vocabularyScore={weaknessAnalysis.weakness_detailed_analysis_summary.vocabulary_score}
                expressionScore={weaknessAnalysis.weakness_detailed_analysis_summary.expression_score}
                structureScore={weaknessAnalysis.weakness_detailed_analysis_summary.structure_score}
              />
            </div>
          )}

          {/* タブナビゲーション */}
          {!analysisLoading && !resultsLoading && weaknessAnalysis && (
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('commentary')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'commentary'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    論評
                  </button>
                  <button
                    onClick={() => setActiveTab('correction')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'correction'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    添削
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* 論評タブ - カテゴリ別詳細分析 */}
          {!analysisLoading && weaknessAnalysis && activeTab === 'commentary' && (
            <div className="space-y-8">
              {/* カテゴリ別分析 */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">カテゴリ別詳細分析</h2>
                <div className="space-y-6">
                  {sortedCategoryAnalysisSummary.map((category) => (
                    <div
                      key={category.id}
                      className={`border ${
                        category.score >= 80
                          ? 'border-blue-200'
                          : category.score >= 60
                            ? 'border-yellow-200'
                            : 'border-red-200'
                      } rounded-lg p-4`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{category.category_name}</h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                            category.score >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : category.score >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {category.is_strength ? '強み' : category.is_weakness ? '弱点' : '普通'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-2xl font-bold ${
                              category.score >= 80
                                ? 'text-blue-800'
                                : category.score >= 60
                                  ? 'text-yellow-800'
                                  : 'text-red-800'
                            }`}
                          >
                            {category.score}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">点</span>
                        </div>
                      </div>
                      
                      {category.strengths.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-blue-700 mb-2">強み</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {category.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {category.issues.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">課題</h4>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">学習アドバイス・改善提案</h2>
                
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
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">応援メッセージ</h3>
                    <p className="text-blue-800 leading-relaxed">
                      {weaknessAnalysis.weakness_learning_advice_summary.motivational_message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 添削タブ - 添削結果一覧 */}
          {!resultsLoading && correctResults.length > 0 && activeTab === 'correction' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">添削結果一覧</h2>
                <div className="space-y-6">
                  {correctResults.map((result, index) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            問題 {index + 1}: {result.question_template_master.category.name}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                            result.get_points === result.question_template_master.points
                              ? 'bg-blue-100 text-blue-800'
                              : result.get_points > result.question_template_master.points * 0.7
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {result.get_points}/{result.question_template_master.points}点
                          </span>
                        </div>
                      </div>

                      {/* 問題文 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">問題文</h4>
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <p className="mb-2"><strong>英語:</strong> {result.question_template_master.english}</p>
                          <p><strong>日本語:</strong> {result.question_template_master.japanese}</p>
                        </div>
                      </div>

                      {/* 回答 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">あなたの回答</h4>
                        <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                          {result.question_answer.user_answer}
                        </p>
                      </div>

                      {/* 添削結果 */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">添削結果</h4>
                        <div className="text-sm text-gray-900 bg-slate-50 p-3 rounded border-l-4 border-blue-300 whitespace-pre-line">
                          {result.example_correction}
                        </div>
                      </div>

                      {/* 模範解答 */}
                      {result.advice && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">アドバイス</h4>
                          <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded border-l-4 border-blue-400 whitespace-pre-line">
                            {result.advice}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 添削結果がない場合 */}
          {!resultsLoading && correctResults.length === 0 && activeTab === 'correction' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">添削結果がありません</h3>
                <p className="text-gray-600">まだ添削結果がありません。問題を解いて添削を受けてみましょう。</p>
              </div>
            </div>
          )}

          {/* ローディング状態 */}
          {(analysisLoading || resultsLoading) && (
            <LoadingSpinner text="分析結果を読み込み中..." />
          )}

          {/* エラー状態またはデータなし */}
          {!analysisLoading && !resultsLoading && !weaknessAnalysis && activeTab === 'commentary' && (
            <EmptyState />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
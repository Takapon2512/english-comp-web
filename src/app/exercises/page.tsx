'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ExerciseProjectCard } from '@/components/pages/exercises/ExerciseProjectCard';
import { getProjects, Project } from '@/lib/api/project';
import { useState, useEffect } from 'react';

export default function ExercisesPage() {
  const { isLoading } = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プロジェクト一覧取得
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setError(null);
      const response = await getProjects(1, 20); // 演習用なので多めに取得
      setProjects(response.projects);
    } catch (err) {
      console.error('プロジェクト取得エラー:', err);
      setError('プロジェクトの取得に失敗しました');
    } finally {
      setProjectsLoading(false);
    }
  };

  // 認証完了後にプロジェクト取得
  useEffect(() => {
    if (!isLoading) {
      fetchProjects();
    }
  }, [isLoading]);

  // ローディング進捗のシミュレーション
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + Math.random() * 25;
        });
      }, 110);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="演習問題を読み込み中..."
      progressText="問題データを準備しています..."
      progressColor="gradient"
      overlay={true}
    />;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">演習問題</h1>
            <p className="text-gray-600">
              プロジェクトを選択して演習を開始しましょう
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-800">
                  <p className="font-medium">エラーが発生しました</p>
                  <p className="text-sm">{error}</p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={fetchProjects}>
                    再試行
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ローディング表示 */}
          {projectsLoading && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">演習可能なプロジェクトを読み込み中...</p>
            </div>
          )}

          {/* プロジェクト一覧 */}
          {!projectsLoading && !error && projects.length > 0 && (
            <>
              {/* プロジェクトカード一覧 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ExerciseProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          )}

          {/* 空の状態 */}
          {!projectsLoading && !error && projects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">演習可能なプロジェクトがありません</h2>
              <p className="text-gray-600 mb-6">
                まずはプロジェクトを作成し、問題を追加してから演習を開始してください。
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/projects'}>
                プロジェクト管理へ
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

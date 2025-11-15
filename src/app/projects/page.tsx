'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/pages/projects/ProjectCard';
import { CreateProjectModal } from '@/components/pages/projects/CreateProjectModal';
import { getProjects, Project } from '@/lib/api/project';

export default function ProjectsPage() {
  const { isLoading } = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // プロジェクト一覧取得
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setError(null);
      const response = await getProjects(1, 10);
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
          if (prev >= 80) {
            clearInterval(interval);
            return 80;
          }
          return prev + Math.random() * 30;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="プロジェクトを読み込み中..."
      progressText="プロジェクトデータを同期しています..."
      progressColor="primary"
      overlay={true}
    />;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー部分 */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">プロジェクト</h1>
                <p className="mt-2 text-gray-600">英語学習プロジェクト管理</p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  + 新規プロジェクト
                </Button>
              </div>
            </div>
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
              <p className="text-gray-600">プロジェクトを読み込み中...</p>
            </div>
          )}

          {/* プロジェクト一覧 */}
          {!projectsLoading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* 空の状態 */}
          {!projectsLoading && !error && projects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">プロジェクトがありません</h2>
              <p className="text-gray-600 mb-6">
                新しいプロジェクトを作成して英語学習を始めましょう。
              </p>
              <Button 
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + 最初のプロジェクトを作成
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* プロジェクト作成モーダル */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </DashboardLayout>
  );
}
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { getProjects, Project } from '@/lib/api/project';
import { formatDateShort } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const { isLoading } = useAuth();
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 詳細ページへの遷移
  const handleViewDetails = (projectId: string) => {
    router.push(`/results/${projectId}`);
  };

  // プロジェクト一覧を取得
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setError(null);
      const response = await getProjects(1, 10);
      setProjects(response.projects);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
      setError('プロジェクトの取得に失敗しました');
    } finally {
      setProjectsLoading(false);
    }
  }

  // 認証完了後にプロジェクト一覧を取得
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
      }, 90);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="学習結果を読み込み中..."
      progressText="統計データを分析しています..."
      progressColor="modern"
      overlay={true}
    />;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">学習結果</h1>
            <p className="text-gray-600">
              プロジェクトを選択して結果を確認しましょう
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
              </div>
            </div>
          )}

          {/* ローディング表示 */}
          {projectsLoading && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">学習結果を読み込み中...</p>
            </div>
          )}

          {/* プロジェクト一覧 */}
          {!projectsLoading && !error && projects.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">プロジェクト一覧</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {projects.length}件のプロジェクトが見つかりました
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>プロジェクト名</TableHead>
                    <TableHead className="max-w-xs">プロジェクト詳細</TableHead>
                    <TableHead className="w-24">作成日時</TableHead>
                    <TableHead className="w-24">更新日時</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-32" title={project.name}>
                          {project.name.length > 20 ? project.name.substring(0, 32) + '...' : project.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48" title={project.description}>
                          {project.description.length > 32 ? project.description.substring(0, 48) + '...' : project.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDateShort(project.created_at)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDateShort(project.updated_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(project.id)}
                          className="text-xs px-2 py-1"
                        >
                          詳細
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* プロジェクトが見つからない場合 */}
          {!projectsLoading && !error && projects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">プロジェクトが見つかりません</h3>
              <p className="text-gray-600 mb-6">
                まだプロジェクトが作成されていないか、結果がありません。
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/projects')}
              >
                プロジェクトを作成する
              </Button>
            </div>
          )}
          
        </div>
      </div>
    </DashboardLayout>
  );
}

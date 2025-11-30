'use client';

import { DashboardLayout } from "@/components/layout";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProject, getProjectQuestions, Project, Question } from '@/lib/api/project';
import { Button, Loading } from '@/components/ui';
import { QuestionCard } from '@/components/pages/projects/QuestionCard';
import { AddQuestionSidebar } from '@/components/pages/projects/AddQuestionSidebar';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddQuestionSidebarOpen, setIsAddQuestionSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProject(projectId);
        setProject(response.project);
      } catch (err) {
        console.error('プロジェクト詳細の取得に失敗しました:', err);
        setError('プロジェクト詳細の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await getProjectQuestions(projectId);
        setQuestions(response.questions);
      } catch (err) {
        console.error('問題一覧の取得に失敗しました:', err);
      } finally {
        setQuestionsLoading(false);
      }
    };

    if (projectId && project) {
      fetchQuestions();
    }
  }, [projectId, project]);

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const response = await getProjectQuestions(projectId);
      setQuestions(response.questions);
    } catch (err) {
      console.error('問題一覧の取得に失敗しました:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleQuestionAdded = () => {
    // 問題が追加されたら問題一覧を再取得
    fetchQuestions();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Loading />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">プロジェクトが見つかりません</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="flex justify-between items-center"
          >
            <div>    
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="mt-2 text-gray-600">{project.description}</p>
            </div>
            <div
              className="flex space-x-2"
            >
              <Button variant="primary" size="sm">
                演習する
              </Button>
              <Button variant="outline" size="sm">
                編集
              </Button>
            </div>
          </div>

          {/* プロジェクト問題一覧 */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">問題一覧</h2>
              </div>
              
              {questionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  このプロジェクトには問題がありません
                </div>
              )}
              <div
                className="text-center p-3 bg-blue-50 rounded-lg mt-4 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => setIsAddQuestionSidebarOpen(true)}
              >
                <span className="text-blue-800 font-medium text-lg">
                  + 問題を追加する
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1">
            {/* プロジェクト基本情報 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">このプロジェクトについて</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">プロジェクトID</span>
                  <p className="text-gray-900 font-mono text-sm">{project.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">問題数</span>
                  <p className="text-gray-900">{project.total_questions}問</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">作成日時</span>
                  <p className="text-gray-900">{formatDate(project.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">更新日時</span>
                  <p className="text-gray-900">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 問題追加サイドバー */}
      <AddQuestionSidebar
        isOpen={isAddQuestionSidebarOpen}
        onClose={() => setIsAddQuestionSidebarOpen(false)}
        projectId={projectId}
        onQuestionAdded={handleQuestionAdded}
      />
    </DashboardLayout>
  )
}
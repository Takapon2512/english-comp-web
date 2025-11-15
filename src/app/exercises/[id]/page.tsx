'use client';

import { FullScreenLoading, Button } from '@/components';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuestionInfoSidebar, QuestionDisplay, AnswerArea, StudyHints } from '@/components/pages/exercises';
import { useAuth } from '@/hooks/useAuth';
import { Project, getProject, Question, getQuestionToAnswer, getProjectQuestions, submitAnswer as submitAnswerAPI, SubmitAnswerRequest, requestCorrection, CorrectAnswerRequest, finishExercise } from '@/lib/api/project';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

// サンプル問題データ
const sampleQuestion: Question = {
  id: 'sample-1',
  category_id: 'cat-1',
  question_type: 'essay',
  english: 'Describe your favorite hobby and explain why you enjoy it.',
  japanese: 'あなたの好きな趣味について説明し、なぜそれを楽しんでいるのかを説明してください。',
  status: 'ACTIVE',
  level: 'inter',
  estimated_time: 300, // 5分
  points: 10,
  category: {
    id: 'cat-1',
    name: 'ライティング'
  }
};

export default function ExercisePage() {
  const { isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(sampleQuestion);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjectData = useCallback(async () => {
    try {
      // プロジェクト情報を取得
      const projectResponse = await getProject(projectId);
      setProject(projectResponse.project);
      
      // 出題用APIから次の問題を取得
      try {
        const questionResponse = await getQuestionToAnswer(projectId);
        setCurrentQuestion(questionResponse.question);
        setCurrentQuestionNumber(questionResponse.now_question_number);
      } catch (questionError) {
        console.warn('問題の取得に失敗しました。サンプル問題を使用します:', questionError);
        setCurrentQuestion(sampleQuestion);
        setCurrentQuestionNumber(1);
      }
    } catch (error) {
      console.error('プロジェクトの取得に失敗しました:', error);
      setError('プロジェクトの取得に失敗しました');
      // エラーでもサンプル問題は表示
      setCurrentQuestion(sampleQuestion);
      setCurrentQuestionNumber(1);
    }
  }, [projectId]);

  const fetchprojectQuestionsData = useCallback(async () => {
    try {
      const questionsResponse = await getProjectQuestions(projectId);
      setQuestions(questionsResponse.questions);
    } catch (error) {
      console.error('問題の取得に失敗しました:', error);
      setError('問題の取得に失敗しました');
      setCurrentQuestion(sampleQuestion);
      setCurrentQuestionNumber(1);
    }
  }, [projectId]);

  useEffect(() => {
    if (!isLoading) {
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

      fetchProjectData();
      fetchprojectQuestionsData();
    }
  }, [projectId, isLoading, fetchProjectData, fetchprojectQuestionsData]);

  // 添削リクエスト（非同期実行）
  const requestCorrectionAsync = useCallback(async (questionAnswerId: string, questionTemplateId: string) => {
    try {
      const correctionRequest: CorrectAnswerRequest = {
        question_answer_id: questionAnswerId,
        question_template_master_id: questionTemplateId
      };

      const correctionResponse = await requestCorrection(correctionRequest);
      console.log('添削リクエスト成功:', correctionResponse);
    } catch (error) {
      console.error('添削リクエストに失敗しました:', error);
      // 添削の失敗はユーザーの学習を妨げないため、エラー表示はしない
    }
  }, []);

  // 演習完了処理
  const handleExerciseCompletion = useCallback(async () => {
    try {
      const finishResponse = await finishExercise(projectId);
      console.log('演習完了処理成功:', finishResponse);
      
      // 完了した解答の数を表示
      const completedCount = finishResponse.question_answers.length;
      alert(`お疲れ様でした！\n${completedCount}問の演習が完了しました。\n結果画面に移動します。`);
      
      router.push('/exercises');
    } catch (error) {
      console.error('演習完了処理に失敗しました:', error);
      // エラーが発生しても演習一覧に戻る
      alert('演習が完了しました。\n結果画面に移動します。');
      router.push('/exercises');
    }
  }, [projectId, router]);

  // 解答提出
  const submitAnswer = useCallback(async () => {
    if (!userAnswer.trim()) {
      alert('解答を入力してください。');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitRequest: SubmitAnswerRequest = {
        project_id: projectId,
        question_template_master_id: currentQuestion.id,
        user_answer: userAnswer.trim()
      };

      const response = await submitAnswerAPI(submitRequest);
      console.log('解答提出成功:', response);
      
      // 添削リクエストを非同期で実行（ユーザーを待たせない）
      requestCorrectionAsync(response.id, response.question_template_master_id);
      
      // 提出後は解答をクリア
      setUserAnswer('');
      
      // 次の問題を取得
      try {
        const nextQuestionResponse = await getQuestionToAnswer(projectId);
        setCurrentQuestion(nextQuestionResponse.question);
        setCurrentQuestionNumber(nextQuestionResponse.now_question_number);
      } catch (nextQuestionError) {
        console.warn('次の問題の取得に失敗しました:', nextQuestionError);
        // 次の問題がない場合は演習完了処理を実行
        await handleExerciseCompletion();
      }
    } catch (error) {
      console.error('解答提出に失敗しました:', error);
      setError('解答の提出に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }, [userAnswer, projectId, currentQuestion.id, requestCorrectionAsync, handleExerciseCompletion]);

  // 解答変更
  const handleAnswerChange = (answer: string) => {
    setUserAnswer(answer);
  };

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
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">演習問題 #{currentQuestionNumber}</h1>
                <p className="text-gray-600">{project?.name || 'サンプルプロジェクト'}の演習問題</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/exercises')}
              >
                演習一覧に戻る
              </Button>
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <p className="text-red-600 text-sm mt-1">サンプル問題で演習を続行できます。</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左サイドバー: カテゴリ・問題情報 */}
            <div className="lg:col-span-1">
              <QuestionInfoSidebar
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionNumber - 1}
                totalQuestions={questions.length}
              />
            </div>

            {/* メインエリア: 問題と解答 */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* 問題表示エリア */}
                <QuestionDisplay
                  currentQuestion={currentQuestion}
                />

                {/* 解答エリア */}
                <AnswerArea
                  currentQuestion={currentQuestion}
                  userAnswer={userAnswer}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={submitAnswer}
                  isSubmitting={isSubmitting}
                />

                {/* 学習のヒント */}
                <StudyHints />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
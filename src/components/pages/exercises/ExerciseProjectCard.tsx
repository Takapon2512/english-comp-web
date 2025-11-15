import { Button } from '@/components/ui';
import { Project, getProjectQuestions } from '@/lib/api/project';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ExerciseProjectCardProps {
  project: Project;
}

export const ExerciseProjectCard: React.FC<ExerciseProjectCardProps> = ({ project }) => {
  const router = useRouter();
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState<number>(0);

  // プロジェクトの問題一覧を取得
  useEffect(() => {
    const fetchQuestions = async () => {
      if (project.total_questions === 0) {
        setTotalEstimatedTime(0);
        return;
      }

      try {
        setQuestionsLoading(true);
        const response = await getProjectQuestions(project.id);
        
        // 推定時間の合計を計算
        const totalTime = response.questions.reduce((sum, question) => sum + question.estimated_time, 0);
        setTotalEstimatedTime(totalTime);
      } catch (error) {
        console.error('問題取得エラー:', error);
        // エラーの場合は問題数 × 3分で代替計算
        setTotalEstimatedTime(project.total_questions * 3);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [project.id, project.total_questions]);

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  // 演習開始ハンドラー
  const handleStartExercise = () => {
    // TODO: 演習開始ページへのルーティング（将来実装）
    router.push(`/exercises/${project.id}`);
  };

  // レベル表示用のバッジカラー
  const getLevelBadgeColor = (questionCount: number) => {
    if (questionCount === 0) return 'bg-gray-100 text-gray-600';
    if (questionCount < 10) return 'bg-green-100 text-green-700';
    if (questionCount < 20) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // 推定時間フォーマット（分単位から時間:分形式へ）
  const formatEstimatedTime = (minutes: number) => {
    if (minutes === 0) return '0分';
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 hover:border-blue-300">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-3">{project.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(project.total_questions)}`}>
            {project.total_questions}問
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
      
      {/* 演習情報 */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-sm">
          <div className="flex items-center">
            <span className="text-blue-600 mr-1">⏱️</span>
            <span className="text-gray-700">
              推定時間: {questionsLoading ? '計算中...' : formatEstimatedTime(totalEstimatedTime)}
            </span>
          </div>
        </div>
      </div>
      
      {/* プロジェクト詳細情報 */}
      <div className="grid grid-cols-1 gap-1 text-xs text-gray-500 mb-4">
        <span>作成日: {formatDate(project.created_at)}</span>
        <span>最終更新: {formatDate(project.updated_at)}</span>
      </div>
      
      <div className="flex justify-end items-center">
        <Button
          variant="primary"
          size="sm"
          onClick={handleStartExercise}
          disabled={project.total_questions === 0}
          className={project.total_questions === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {project.total_questions === 0 ? '問題なし' : '演習を開始'}
        </Button>
      </div>
    </div>
  );
}

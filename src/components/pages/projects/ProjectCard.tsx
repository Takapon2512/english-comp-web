import { Button } from '@/components/ui';
import { Project } from '@/lib/api/project';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  // プロジェクト詳細ページへのリンク
  const handleOpenProject = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-white to-gray-50 cursor-pointer rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1 overflow-hidden"
      onClick={handleOpenProject}
    >
      
      {/* メインコンテンツ */}
      <div className="relative z-10">
        {/* ヘッダー部分 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* プロジェクトアイコン */}
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200">{project.name}</h3>
              <div className="flex items-center space-x-2">
                {project.created_at && (
                  <span className="text-xs text-gray-500">
                    作成日: {formatDate(project.created_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* 右上のアクションアイコン */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* 説明文 */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
        
        {/* フッター部分 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* 統計情報 */}
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>問題数: {project.total_questions}</span>
            </div>
          </div>
          
          {/* 開くボタン */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenProject();
              }}
            >
              開く
            </Button>
          </div>
        </div>
      </div>
      
      {/* ホバー時のグロー効果 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Checkbox } from '@/components/ui';
import { getQuestionMasters, addQuestionToProject, QuestionMaster } from '@/lib/api/project';

interface AddQuestionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onQuestionAdded?: () => void;
}

export const AddQuestionSidebar = ({ 
  isOpen, 
  onClose, 
  projectId, 
  onQuestionAdded 
}: AddQuestionSidebarProps) => {
  const [questionMasters, setQuestionMasters] = useState<QuestionMaster[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // サイドバーが開いたときに問題マスターを取得
  useEffect(() => {
    if (isOpen) {
      fetchQuestionMasters();
      setSelectedQuestions(new Set());
      setSearchTerm('');
      setLevelFilter('all');
      setTypeFilter('all');
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const fetchQuestionMasters = async () => {
    try {
      setLoading(true);
      const response = await getQuestionMasters(1, 50, projectId); // 最初の50件を取得
      setQuestionMasters(response.question_template_masters);
    } catch (error) {
      console.error('問題マスターの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedQuestions.size === 0) return;
    
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      const response = await addQuestionToProject(projectId, Array.from(selectedQuestions));
      
      console.log(`${response.project_questions.length}問の問題をプロジェクトに追加しました:`, response.project_questions);
      
      // 成功メッセージを表示
      setSuccessMessage(`${response.project_questions.length}問の問題をプロジェクトに追加しました！`);
      
      // 1.5秒後に閉じる
      setTimeout(() => {
        if (onQuestionAdded) {
          onQuestionAdded();
        }
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('問題の追加に失敗しました:', error);
      // TODO: エラーメッセージをユーザーに表示
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'basic': return '初級';
      case 'inter': return '中級';
      case 'adv': return '上級';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'inter': return 'bg-yellow-100 text-yellow-800';
      case 'adv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'essay': return 'エッセイ';
      case 'fill': return '穴埋め';
      case 'choice': return '選択問題';
      case 'translate': return '翻訳';
      default: return type;
    }
  };

  // フィルタリング
  const filteredQuestions = questionMasters.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.name.includes(searchTerm);
    
    const matchesLevel = levelFilter === 'all' || question.level === levelFilter;
    const matchesType = typeFilter === 'all' || question.question_type === typeFilter;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">問題を追加</h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedQuestions.size}問選択中
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* フィルター・検索 */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            {/* 検索 */}
            <div>
              <Input
                label="問題を検索..."
                placeholder="問題を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* フィルター */}
            <div className="flex space-x-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全レベル</option>
                <option value="basic">初級</option>
                <option value="inter">中級</option>
                <option value="adv">上級</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全タイプ</option>
                <option value="essay">エッセイ</option>
                <option value="fill">穴埋め</option>
                <option value="choice">選択問題</option>
                <option value="translate">翻訳</option>
              </select>
            </div>
          </div>

          {/* 成功メッセージ */}
          {successMessage && (
            <div className="p-6 border-b border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* 問題一覧 */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedQuestions.has(question.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleQuestionToggle(question.id)}
                  >
                    <div>
                      <Checkbox
                        label={question.japanese}
                        checked={selectedQuestions.has(question.id)}
                        onChange={() => handleQuestionToggle(question.id)}
                        className="my-4"
                      />
                      <div className="flex-1 min-w-0 mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(question.level)}`}>
                            {getLevelLabel(question.level)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {getQuestionTypeLabel(question.question_type)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {question.category.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{question.estimated_time}分</span>
                          <span>•</span>
                          <span>{question.points}pt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                条件に一致する問題がありません
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedQuestions.size === 0}
                className="flex-1"
              >
                {isSubmitting ? '追加中...' : `${selectedQuestions.size}問を追加`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

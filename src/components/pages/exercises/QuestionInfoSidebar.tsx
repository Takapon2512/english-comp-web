import React from 'react';
import { Question } from '@/lib/api/project';

interface QuestionInfoSidebarProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const QuestionInfoSidebar: React.FC<QuestionInfoSidebarProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions
}) => {
  // レベル表示
  const getLevelDisplay = (level: string) => {
    const levelMap = {
      'beg': { text: '初級', color: 'bg-green-100 text-green-800' },
      'inter': { text: '中級', color: 'bg-yellow-100 text-yellow-800' },
      'adv': { text: '上級', color: 'bg-red-100 text-red-800' }
    };
    return levelMap[level as keyof typeof levelMap] || { text: level, color: 'bg-gray-100 text-gray-800' };
  };

  // 問題タイプ表示
  const getQuestionTypeDisplay = (type: string) => {
    const typeMap = {
      'essay': 'エッセイ',
      'fill': '穴埋め',
      'choice': '選択問題',
      'translate': '翻訳'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const levelDisplay = getLevelDisplay(currentQuestion.level);

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">問題情報</h3>
      
      {/* 進捗 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>進捗</span>
          <span>{currentQuestionIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* カテゴリ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {currentQuestion.category.name}
        </span>
      </div>

      {/* 問題タイプ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">問題タイプ</label>
        <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
          {getQuestionTypeDisplay(currentQuestion.question_type)}
        </span>
      </div>

      {/* レベル */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">レベル</label>
        <span className={`inline-block text-sm px-3 py-1 rounded-full ${levelDisplay.color}`}>
          {levelDisplay.text}
        </span>
      </div>

      {/* 配点 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">配点</label>
        <span className="text-lg font-semibold text-gray-900">{currentQuestion.points}点</span>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { Question } from '@/lib/api/project';
import { Button } from '@/components/ui';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      case 'beg': return 'bg-green-100 text-green-800';
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

  return (
    <div className="bg-white border border-gray-200 hover:border-blue-300 rounded-lg">
      {/* カードヘッダー */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
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
            <p className="text-gray-900 font-medium line-clamp-2">
              {question.japanese}
            </p>
          </div>
          <div className="ml-4 flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{question.estimated_time}分</span>
              <span>•</span>
              <span>{question.points}pt</span>
            </div>
            <div className="text-xs text-gray-400">
              {isExpanded ? '▲' : '▼'}
            </div>
          </div>
        </div>
      </div>

      {/* 展開時の詳細情報 */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4">
          <div className="space-y-4">
            {/* 英語問題文 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">English</h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {question.english}
              </p>
            </div>

            {/* 問題詳細情報 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">問題タイプ:</span>
                <span className="ml-2 font-medium">{getQuestionTypeLabel(question.question_type)}</span>
              </div>
              <div>
                <span className="text-gray-500">レベル:</span>
                <span className="ml-2 font-medium">{getLevelLabel(question.level)}</span>
              </div>
              <div>
                <span className="text-gray-500">予想時間:</span>
                <span className="ml-2 font-medium">{question.estimated_time}分</span>
              </div>
              <div>
                <span className="text-gray-500">獲得ポイント:</span>
                <span className="ml-2 font-medium">{question.points}pt</span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                閉じる
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-500"
              >
                問題を削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

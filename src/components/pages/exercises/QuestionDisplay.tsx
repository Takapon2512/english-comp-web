import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Question } from '@/lib/api/project';

interface QuestionDisplayProps {
  currentQuestion: Question;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  currentQuestion
}) => {
  const [showJapanese, setShowJapanese] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">問題ID: {currentQuestion.id}</h2>
      </div>

      {/* 英語問題文 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-lg text-gray-900 leading-relaxed">
            {currentQuestion.english}
          </p>
        </div>
      </div>

      {/* 日本語表示切り替えボタン */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowJapanese(!showJapanese)}
        >
          {showJapanese ? '日本語を隠す' : '日本語を表示'}
        </Button>
      </div>

      {/* 日本語問題文（条件付き表示） */}
      {showJapanese && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">日本語</label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-base text-gray-700 leading-relaxed">
              {currentQuestion.japanese}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

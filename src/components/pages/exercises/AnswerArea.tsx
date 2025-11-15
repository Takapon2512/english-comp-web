import React from 'react';
import { Button } from '@/components/ui';
import { Question } from '@/lib/api/project';

interface AnswerAreaProps {
  currentQuestion: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const AnswerArea: React.FC<AnswerAreaProps> = ({
  currentQuestion, // eslint-disable-line @typescript-eslint/no-unused-vars -- 将来的に問題タイプに応じた解答エリアのカスタマイズに使用予定
  userAnswer,
  onAnswerChange,
  onSubmit,
  isSubmitting = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">解答エリア</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={!userAnswer.trim() || isSubmitting}
        >
          {isSubmitting ? '提出中...' : '解答提出'}
        </Button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          あなたの解答を英語で記入してください
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer in English here..."
          disabled={isSubmitting}
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="flex justify-start items-center mt-2 text-sm text-gray-500">
          <span>{userAnswer.length} 文字</span>
        </div>
      </div>
    </div>
  );
};

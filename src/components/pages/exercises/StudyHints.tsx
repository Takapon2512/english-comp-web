import React from 'react';

export const StudyHints: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">学習のヒント</h3>
      <div className="space-y-3 text-sm text-gray-600">
        <p>• まずは英語の問題文をしっかり理解しましょう</p>
        <p>• 分からない場合は日本語を確認してから解答してください</p>
        <p>• 文法や語彙の正確性も重要です</p>
        <p>• 具体例を交えて説明すると良い解答になります</p>
      </div>
    </div>
  );
};

'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ローディング進捗のシミュレーション
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 75) {
            clearInterval(interval);
            return 75;
          }
          return prev + Math.random() * 35;
        });
      }, 80);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="設定を読み込み中..."
      progressText="設定情報を取得しています..."
      progressColor="secondary"
      overlay={true}
    />;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">設定</h1>
            </div>
          </div>

          {/* 設定内容 */}
          <div className="px-6 py-6 space-y-8">
            {/* アカウント設定 */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">アカウント設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">ユーザー名</h3>
                    <p className="text-sm text-gray-600">{user?.name || '未設定'}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    変更
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">メールアドレス</h3>
                    <p className="text-sm text-gray-600">{user?.email || '未設定'}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    変更
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">パスワード</h3>
                    <p className="text-sm text-gray-600">最後に変更してから30日経過</p>
                  </div>
                  <Button variant="outline" size="sm">
                    変更
                  </Button>
                </div>
              </div>
            </div>

            {/* 通知設定 */}
            {/* <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">通知設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">プッシュ通知</h3>
                    <p className="text-sm text-gray-600">学習リマインダーや重要な更新を受け取る</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">メール通知</h3>
                    <p className="text-sm text-gray-600">週次レポートやニュースレターを受け取る</p>
                  </div>
                  <button
                    onClick={() => setEmailUpdates(!emailUpdates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div> */}

            {/* 表示設定 */}
            {/* <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">表示設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">ダークモード</h3>
                    <p className="text-sm text-gray-600">暗いテーマを使用する</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div> */}

            {/* 危険な操作 */}
            <div>
              <h2 className="text-lg font-medium text-red-600 mb-4">危険な操作</h2>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-900 mb-2">アカウントを削除</h3>
                  <p className="text-sm text-red-700 mb-4">
                    アカウントを削除すると、すべての学習データが永久に失われます。この操作は取り消せません。
                  </p>
                  <Button variant="secondary" size="sm">
                    アカウントを削除
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

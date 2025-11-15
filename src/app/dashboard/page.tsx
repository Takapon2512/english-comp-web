'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, logout, refreshToken } = useAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ローディング進捗のシミュレーション
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // 実際の読み込み完了まで90%で待機
          }
          return prev + Math.random() * 20;
        });
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="ダッシュボードを読み込み中..."
      progressText="ユーザー情報を取得しています..."
      progressColor="gradient"
      overlay={true}
    />;
  }

  const handleRefreshToken = async () => {
    const success = await refreshToken();
    if (success) {
      alert('トークンが正常にリフレッシュされました！');
    } else {
      alert('トークンのリフレッシュに失敗しました。');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="mt-2 text-gray-600">LLD English 学習プラットフォーム</p>
          </div>

          {user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ユーザー情報</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">名前</label>
                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ユーザーID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">トークン管理</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-4">
                このアプリケーションは自動的にトークンをリフレッシュします。
                トークンの有効期限が近づくと、バックグラウンドで新しいトークンを取得します。
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={handleRefreshToken}
                  variant="outline"
                  size="sm"
                >
                  手動でトークンをリフレッシュ
                </Button>
                <Button 
                  onClick={logout}
                  variant="secondary"
                  size="sm"
                >
                  ログアウト
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ナビゲーション</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/profile" className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">👤</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">プロフィール</h3>
                      <p className="text-sm text-gray-600">アカウント情報を確認</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/settings" className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-semibold">⚙️</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">設定</h3>
                      <p className="text-sm text-gray-600">アカウント設定を変更</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">📚</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">英語学習</h3>
                    <p className="text-sm text-gray-600">学習コンテンツ（準備中）</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">📊</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">進捗管理</h3>
                    <p className="text-sm text-gray-600">学習進捗（準備中）</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ミドルウェアテスト</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">認証テスト</h3>
              <p className="text-sm text-yellow-700 mb-4">
                以下のリンクをクリックして、ミドルウェアの認証機能をテストできます。
                ログアウト後にこれらのページにアクセスすると、自動的にログインページにリダイレクトされます。
              </p>
              <div className="flex space-x-3">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    プロフィールページ
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    設定ページ
                  </Button>
                </Link>
                <Button onClick={logout} variant="secondary" size="sm">
                  ログアウトしてテスト
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
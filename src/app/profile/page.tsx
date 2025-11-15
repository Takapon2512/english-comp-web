'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, FullScreenLoading, ProgressBar } from '@/components/ui';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ローディング進捗のシミュレーション
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + Math.random() * 25;
        });
      }, 120);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={loadingProgress}
      text="プロフィールを読み込み中..."
      progressText="アカウント情報を取得しています..."
      progressColor="modern"
      overlay={true}
    />;
  }

  // プロフィール画像アップロードのシミュレーション
  const handleImageUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // プログレスバーのアニメーション
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            alert('プロフィール画像がアップロードされました！');
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  // アップロード中のフルスクリーンローディング表示
  if (isUploading) {
    return <FullScreenLoading 
      showProgress={true}
      progress={uploadProgress}
      text="プロフィール画像をアップロード中"
      progressText="画像を処理しています..."
      progressColor="gradient"
      overlay={true}
    />;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
              <div className="flex space-x-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    ダッシュボードに戻る
                  </Button>
                </Link>
                <Button onClick={logout} variant="secondary" size="sm">
                  ログアウト
                </Button>
              </div>
            </div>
          </div>

          {/* プロフィール情報 */}
          <div className="px-6 py-6">
            {user ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleImageUpload}
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                      title="プロフィール画像を変更"
                    >
                      <span className="text-xs text-blue-500">📷</span>
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">ユーザーID: {user.id}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">アカウント情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">氏名</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                        {user.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                      <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">学習統計</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-blue-800">完了したレッスン</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-green-800">学習時間（分）</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-purple-800">獲得ポイント</div>
                    </div>
                  </div>
                  
                  {/* 学習進捗バー */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>今月の学習目標</span>
                        <span>75%</span>
                      </div>
                      <ProgressBar 
                        progress={75} 
                        color="gradient" 
                        size="md" 
                        showPercentage={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>英語レベル進捗</span>
                        <span>42%</span>
                      </div>
                      <ProgressBar 
                        progress={42} 
                        color="modern" 
                        size="md" 
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      プロフィールを編集
                    </Button>
                    <Link href="/settings">
                      <Button variant="primary">
                        設定
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">ユーザー情報を読み込めませんでした。</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  再読み込み
                </Button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

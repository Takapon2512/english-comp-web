'use client';

import { AuthLayout, LoginForm } from '@/components';
import type { LoginResponse } from '@/lib/api';
import { setAccessToken, setRefreshToken } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectPath, setRedirectPath] = useState<string>('/dashboard');

  // URLパラメータからリダイレクト先を取得
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const handleLoginSuccess = (response: LoginResponse) => {
    // ログイン成功時の処理
    console.log('Login successful:', response);
    
    // トークンをクッキーに保存
    setAccessToken(response.access_token, response.expires_in);
    setRefreshToken(response.refresh_token);
    
    // ユーザー情報をローカルストレージに保存
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // 成功メッセージ
    console.log(`ログインに成功しました！ようこそ、${response.user.name}さん`);

    // 指定されたパスまたはダッシュボードにリダイレクト
    router.push(redirectPath);
  };

  return (
    <AuthLayout 
      title="ログイン" 
      subtitle="アカウントにサインインしてください"
    >
      {/* リダイレクト情報の表示 */}
      {redirectPath !== '/dashboard' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">保護されたページにアクセスするには、ログインが必要です。</span>
            <br />
            ログイン後、元のページに戻ります。
          </p>
        </div>
      )}
      
      <LoginForm onSuccess={handleLoginSuccess} />
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない場合は{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

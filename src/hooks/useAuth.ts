'use client';

import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, logout, getValidAccessToken } from '@/lib/utils/tokenManager';

interface User {
  id: string;
  email: string;
  name: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 認証状態とユーザー情報を初期化
  const initializeAuth = useCallback(() => {
    try {
      const authenticated = isAuthenticated();
      setIsAuthenticatedState(authenticated);

      if (authenticated && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('認証状態の初期化エラー:', error);
      setIsAuthenticatedState(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // トークンを手動でリフレッシュ
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = await getValidAccessToken();
      if (token) {
        setIsAuthenticatedState(true);
        return true;
      } else {
        setIsAuthenticatedState(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      setIsAuthenticatedState(false);
      setUser(null);
      return false;
    }
  }, []);

  // ログアウト処理
  const handleLogout = useCallback(() => {
    logout();
    setIsAuthenticatedState(false);
    setUser(null);
  }, []);

  // コンポーネントマウント時に認証状態を確認
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 定期的にトークンの有効性をチェック（5分間隔）
  useEffect(() => {
    if (!isAuthenticatedState) return;

    const interval = setInterval(async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          console.log('トークンが無効になりました。ログアウトします。');
          handleLogout();
        }
      } catch (error) {
        console.error('定期トークンチェックエラー:', error);
        handleLogout();
      }
    }, 5 * 60 * 1000); // 5分間隔

    return () => clearInterval(interval);
  }, [isAuthenticatedState, handleLogout]);

  return {
    isAuthenticated: isAuthenticatedState,
    user,
    isLoading,
    logout: handleLogout,
    refreshToken,
  };
};

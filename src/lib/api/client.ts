import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getValidAccessToken, logout } from '@/lib/utils/tokenManager';

// APIクライアントの設定
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（トークンを自動追加・リフレッシュ）
apiClient.interceptors.request.use(
  async (config) => {
    // 認証が不要なエンドポイント（ログイン、リフレッシュなど）
    const authNotRequiredPaths = ['/auth/login', '/auth/refresh'];
    const isAuthNotRequired = authNotRequiredPaths.some(path => 
      config.url?.includes(path)
    );

    if (!isAuthNotRequired) {
      try {
        // 有効なアクセストークンを取得（必要に応じてリフレッシュ）
        const token = await getValidAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('トークン取得エラー:', error);
        // トークン取得に失敗した場合はログアウト
        logout();
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401エラーの場合の処理
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // トークンリフレッシュを試行
        const newToken = await getValidAccessToken();
        
        if (newToken && originalRequest.headers) {
          // 新しいトークンでリクエストを再試行
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('トークンリフレッシュに失敗しました:', refreshError);
      }

      // リフレッシュに失敗した場合はログアウト
      console.error('認証エラー: ログアウトします');
      logout();
      return Promise.reject(error);
    }

    // その他のエラーハンドリング
    if (error.response?.status && error.response.status >= 500) {
      console.error('サーバーエラー:', error.response.data);
    }

    return Promise.reject(error);
  }
);

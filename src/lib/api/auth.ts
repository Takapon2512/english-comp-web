import { apiClient } from './client';
import type { LoginFormData } from '@/lib/validations';

// ログインAPIのレスポンス型
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ログインAPIのエラーレスポンス型
export interface LoginError {
  message: string;
  errors?: Record<string, string[]>;
}

// リフレッシュトークンAPIのリクエスト型
export interface RefreshTokenRequest {
  refresh_token: string;
}

// リフレッシュトークンAPIのレスポンス型（ログインレスポンスと同じ）
export type RefreshTokenResponse = LoginResponse;

// ログインAPI
export const loginApi = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: data.email,
      password: data.password,
    });
    
    return response.data;
  } catch (error: unknown) {
    // axiosエラーの場合
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: LoginError } };
      const errorData: LoginError = axiosError.response.data;
      throw new Error(errorData.message || 'ログインに失敗しました');
    }
    
    // ネットワークエラーなど
    if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('サーバーに接続できませんでした');
    }
    
    // その他のエラー
    throw new Error('予期しないエラーが発生しました');
  }
};

// リフレッシュトークンAPI
export const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    return response.data;
  } catch (error: unknown) {
    // axiosエラーの場合
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: LoginError } };
      const errorData: LoginError = axiosError.response.data;
      throw new Error(errorData.message || 'トークンの更新に失敗しました');
    }
    
    // ネットワークエラーなど
    if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('サーバーに接続できませんでした');
    }
    
    // その他のエラー
    throw new Error('予期しないエラーが発生しました');
  }
};

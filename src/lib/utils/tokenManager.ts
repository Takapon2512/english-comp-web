import { refreshTokenApi } from '@/lib/api';
import { 
  getAccessToken, 
  getRefreshToken, 
  setAccessToken, 
  setRefreshToken, 
  isTokenExpired, 
  isTokenExpiringSoon, 
  clearAllTokens 
} from './cookies';

// トークンリフレッシュの状態管理
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * トークンを自動的にリフレッシュする
 * 複数の同時リクエストに対して重複実行を防ぐ
 */
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // リフレッシュトークンがない場合
  if (!refreshToken) {
    console.warn('リフレッシュトークンが見つかりません');
    return null;
  }

  // アクセストークンが存在し、まだ有効期限内の場合
  if (accessToken && !isTokenExpiringSoon()) {
    return accessToken;
  }

  // 既にリフレッシュ処理が実行中の場合は、その結果を待つ
  if (isRefreshing && refreshPromise) {
    try {
      return await refreshPromise;
    } catch (error) {
      console.error('トークンリフレッシュの待機中にエラーが発生しました:', error);
      return null;
    }
  }

  // リフレッシュ処理を開始
  isRefreshing = true;
  refreshPromise = performTokenRefresh(refreshToken);

  try {
    const newAccessToken = await refreshPromise;
    return newAccessToken;
  } catch (error) {
    console.error('トークンリフレッシュに失敗しました:', error);
    return null;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

/**
 * 実際のトークンリフレッシュ処理
 */
const performTokenRefresh = async (refreshToken: string): Promise<string> => {
  try {
    console.log('トークンをリフレッシュしています...');
    
    const response = await refreshTokenApi(refreshToken);
    
    // 新しいトークンを保存
    setAccessToken(response.access_token, response.expires_in);
    setRefreshToken(response.refresh_token);
    
    // ユーザー情報も更新（必要に応じて）
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    console.log('トークンリフレッシュが完了しました');
    return response.access_token;
    
  } catch (error) {
    console.error('トークンリフレッシュエラー:', error);
    
    // リフレッシュに失敗した場合、全てのトークンをクリア
    clearAllTokens();
    
    // ユーザー情報もクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    
    throw error;
  }
};

/**
 * 有効なアクセストークンを取得する
 * 必要に応じて自動的にリフレッシュを行う
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken();
  
  // トークンが存在しない場合
  if (!accessToken) {
    return await refreshTokenIfNeeded();
  }
  
  // トークンが期限切れまたは間もなく期限切れの場合
  if (isTokenExpired() || isTokenExpiringSoon()) {
    return await refreshTokenIfNeeded();
  }
  
  return accessToken;
};

/**
 * ログアウト処理
 */
export const logout = () => {
  clearAllTokens();
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    // ログインページにリダイレクト
    window.location.href = '/login';
  }
};

/**
 * 認証状態をチェック
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // リフレッシュトークンがあれば認証済みとみなす
  return !!(refreshToken && (accessToken || !isTokenExpired()));
};

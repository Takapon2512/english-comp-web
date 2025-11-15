// クッキー操作のユーティリティ関数

export const setCookie = (name: string, value: string, days?: number) => {
  if (typeof document === 'undefined') return; // SSR対応
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Strict; Secure`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // SSR対応
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return; // SSR対応
  
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure`;
};

// トークン専用のヘルパー関数
export const setAccessToken = (token: string, expiresInSeconds: number) => {
  // expires_inは秒単位なので、日数に変換
  const days = expiresInSeconds / (24 * 60 * 60);
  setCookie('access_token', token, days);
  
  // トークンの有効期限をタイムスタンプで保存
  const expiresAt = Date.now() + (expiresInSeconds * 1000);
  setCookie('access_token_expires_at', expiresAt.toString(), days);
};

export const getAccessToken = (): string | null => {
  return getCookie('access_token');
};

export const deleteAccessToken = () => {
  deleteCookie('access_token');
  deleteCookie('access_token_expires_at');
};

export const setRefreshToken = (token: string) => {
  // リフレッシュトークンは長期間有効とする（30日）
  setCookie('refresh_token', token, 30);
};

export const getRefreshToken = (): string | null => {
  return getCookie('refresh_token');
};

export const deleteRefreshToken = () => {
  deleteCookie('refresh_token');
};

// トークンの有効期限チェック関数
export const isTokenExpired = (): boolean => {
  const expiresAt = getCookie('access_token_expires_at');
  if (!expiresAt) {
    return true; // 有効期限情報がない場合は期限切れとみなす
  }
  
  const expirationTime = parseInt(expiresAt, 10);
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
};

// トークンが間もなく期限切れかチェック（デフォルト5分前）
export const isTokenExpiringSoon = (bufferMinutes: number = 5): boolean => {
  const expiresAt = getCookie('access_token_expires_at');
  if (!expiresAt) {
    return true; // 有効期限情報がない場合は期限切れとみなす
  }
  
  const expirationTime = parseInt(expiresAt, 10);
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000; // 分をミリ秒に変換
  
  return currentTime >= (expirationTime - bufferTime);
};

// 全てのトークンを削除
export const clearAllTokens = () => {
  deleteAccessToken();
  deleteRefreshToken();
};

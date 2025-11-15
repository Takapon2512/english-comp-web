/**
 * ISO文字列の日付を日本語フォーマットに変換
 * @param dateString ISO形式の日付文字列
 * @returns YYYY年MM月DD日 HH:mm 形式の文字列
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // 無効な日付の場合
    if (isNaN(date.getTime())) {
      return '-';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  } catch (error) {
    console.error('日付フォーマットエラー:', error);
    return '-';
  }
};

/**
 * ISO文字列の日付を短縮フォーマットに変換
 * @param dateString ISO形式の日付文字列
 * @returns YYYY.MM.DD 形式の文字列
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // 無効な日付の場合
    if (isNaN(date.getTime())) {
      return '-';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error('日付フォーマットエラー:', error);
    return '-';
  }
};

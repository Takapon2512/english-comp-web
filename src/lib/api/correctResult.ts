import { apiClient } from './client';

// 添削結果の型定義
export interface CorrectResult {
  id: string;
  project_id: string;
  question_answer_id: string;
  question_template_master_id: string;
  get_points: number;
  example_correction: string;
  correct_rate: number;
  advice: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  challenge_count: number;
  question_answer: {
    id: string;
    user_id: string;
    project_id: string;
    question_template_master_id: string;
    user_answer: string;
  };
  question_template_master: {
    id: string;
    category_id: string;
    question_type: 'essay' | 'fill' | 'choice' | 'translate';
    english: string;
    japanese: string;
    status: 'ACTIVE' | 'INACTIVE';
    level: 'basic' | 'inter' | 'adv';
    estimated_time: number;
    points: number;
    category: {
      id: string;
      name: string;
    };
  };
}

// 添削結果一覧リクエストの型定義
export interface GetCorrectResultsRequest {
  project_id: string;
  challenge_count?: number;
}

// 添削結果一覧レスポンスの型定義
export interface GetCorrectResultsResponse {
  correct_results: CorrectResult[];
}

// 添削結果一覧取得API
export const getCorrectResults = async (request: GetCorrectResultsRequest): Promise<GetCorrectResultsResponse> => {
  const response = await apiClient.post<GetCorrectResultsResponse>('/correct-results/get', request);
  return response.data;
};

import { apiClient } from './client';

// プロジェクトの型定義
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string;
  total_questions: number;
  created_by: string;
  updated_by: string;
}

// プロジェクト一覧レスポンスの型定義
export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  per_page: number;
}

// プロジェクト詳細レスポンスの型定義
export interface ProjectDetailResponse {
  project: Project;
}

// 問題の型定義
export interface Question {
  id: string;
  category_id: string;
  question_type: 'essay' | 'fill' | 'choice' | 'translate';
  english: string;
  japanese: string;
  status: 'ACTIVE' | 'INACTIVE';
  level: 'beg' | 'inter' | 'adv' | 'basic';
  estimated_time: number;
  points: number;
  category: {
    id: string;
    name: string;
  };
}

// プロジェクト問題一覧レスポンスの型定義
export interface ProjectQuestionsResponse {
  questions: Question[];
  total: number;
  answer_count: number;
}

// 問題マスターの型定義
export interface QuestionMaster {
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
}

// 問題マスター一覧レスポンスの型定義
export interface QuestionMastersResponse {
  question_template_masters: QuestionMaster[];
  total: number;
  page: number;
  per_page: number;
}

// プロジェクト作成リクエストの型定義
export interface CreateProjectRequest {
  name: string;
  description: string;
}

// プロジェクト作成レスポンスの型定義（APIは直接プロジェクトオブジェクトを返す）
export interface CreateProjectResponse {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// プロジェクト作成
export const createProject = async (data: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const response = await apiClient.post<CreateProjectResponse>('/projects', data);
  return response.data;
};

// プロジェクト一覧取得
export const getProjects = async (page: number = 1, perPage: number = 10): Promise<ProjectsResponse> => {
  const response = await apiClient.get<ProjectsResponse>(`/projects?per_page=${perPage}&page=${page}`);
  return response.data;
};

// プロジェクト詳細取得
export const getProject = async (id: string): Promise<ProjectDetailResponse> => {
  const response = await apiClient.get<ProjectDetailResponse>(`/projects/${id}`);
  return response.data;
};

// プロジェクトの問題一覧取得
export const getProjectQuestions = async (projectId: string): Promise<ProjectQuestionsResponse> => {
  const response = await apiClient.post<ProjectQuestionsResponse>('/projects/questions', {
    project_id: projectId
  });
  return response.data;
};

// 問題マスター一覧取得
export const getQuestionMasters = async (page: number = 1, perPage: number = 10, projectId: string): Promise<QuestionMastersResponse> => {
  const response = await apiClient.post<QuestionMastersResponse>(`/question-masters?per_page=${perPage}&page=${page}`, {
    project_id: projectId
  });
  return response.data;
};

// プロジェクト問題の型定義
export interface ProjectQuestion {
  id: string;
  project_id: string;
  question_template_master_id: string;
  questions: Question;
}

// プロジェクト問題作成レスポンスの型定義
export interface CreateProjectQuestionsResponse {
  project_questions: ProjectQuestion[];
}

// 出題用APIレスポンスの型定義
export interface QuestionToAnswerResponse {
  question: Question;
  now_question_number: number;
}

// 解答提出リクエストの型定義
export interface SubmitAnswerRequest {
  project_id: string;
  question_template_master_id: string;
  user_answer: string;
}

// 解答提出レスポンスの型定義
export interface SubmitAnswerResponse {
  id: string;
  user_id: string;
  project_id: string;
  question_template_master_id: string;
  user_answer: string;
  challenge_count: number;
}

// 添削リクエストの型定義
export interface CorrectAnswerRequest {
  question_answer_id: string;
  question_template_master_id: string;
}

// 添削レスポンスの型定義
export interface CorrectAnswerResponse {
  id: string;
  question_answer_id: string;
  question_template_master_id: string;
  get_points: number;
  example_correction: string;
  correct_rate: number;
  advice: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  challenge_count: number;
}

// 演習完了後の解答データの型定義
export interface FinishedQuestionAnswer {
  id: string;
  user_id: string;
  project_id: string;
  question_template_master_id: string;
  user_answer: string;
  challenge_count: number;
  status: 'FINISHED';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string;
  created_by: string;
  updated_by: string;
}

// 演習完了APIレスポンスの型定義
export interface FinishExerciseResponse {
  question_answers: FinishedQuestionAnswer[];
}

// プロジェクトに問題を追加
export const addQuestionToProject = async (projectId: string, questionMasterIds: string[]): Promise<CreateProjectQuestionsResponse> => {
  const response = await apiClient.post<CreateProjectQuestionsResponse>('/projects/create-questions', {
    project_id: projectId,
    question_template_master_ids: questionMasterIds
  });
  return response.data;
};

// 出題用API - プロジェクトの次の問題を取得
export const getQuestionToAnswer = async (projectId: string): Promise<QuestionToAnswerResponse> => {
  const response = await apiClient.post<QuestionToAnswerResponse>(`/question-answers/question-to-answer/${projectId}`);
  return response.data;
};

// 解答提出API
export const submitAnswer = async (request: SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
  const response = await apiClient.post<SubmitAnswerResponse>('/question-answers', request);
  return response.data;
};

// 添削API
export const requestCorrection = async (request: CorrectAnswerRequest): Promise<CorrectAnswerResponse> => {
  const response = await apiClient.post<CorrectAnswerResponse>('/correct-results', request);
  return response.data;
};

// 演習完了API - プロジェクトの全解答を完了状態にする
export const finishExercise = async (projectId: string): Promise<FinishExerciseResponse> => {
  const response = await apiClient.put<FinishExerciseResponse>(`/question-answers/finish/${projectId}`);
  return response.data;
};

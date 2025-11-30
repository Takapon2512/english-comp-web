import { apiClient } from './client';

// 弱点分析の詳細分析の型定義
export interface DetailedAnalysis {
  grammar: {
    score: number;
    description: string;
    examples: string[] | null;
  };
  vocabulary: {
    score: number;
    description: string;
    examples: string[] | null;
  };
  expression: {
    score: number;
    description: string;
    examples: string[] | null;
  };
  structure: {
    score: number;
    description: string;
    examples: string[] | null;
  };
}

// パーソナライズされたアドバイスの型定義
export interface PersonalizedAdvice {
  learning_advice: string;
  recommended_actions: string[] | null;
  next_goals: string[] | null;
  study_plan: string;
  motivational_message: string;
}

// 弱点分析サマリーの型定義
export interface WeaknessAnalysisSummary {
  id: string;
  project_id: string;
  analysis_status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  overall_score: number;
  improvement_rate: number;
  weak_categories: string[] | null;
  strength_categories: string[] | null;
  detailed_analysis: DetailedAnalysis;
  personalized_advice: PersonalizedAdvice;
  analysis_date: string;
  analyzed_answers: number;
  data_period_start: string;
  data_period_end: string;
}

// カテゴリ別分析サマリーの型定義
export interface WeaknessCategoryAnalysisSummary {
  id: string;
  analysis_id: string;
  category_id: string;
  category_name: string;
  score: number;
  is_weakness: boolean;
  is_strength: boolean;
  issues: string[];
  strengths: string[];
  examples: string[];
}

// 詳細分析サマリーの型定義
export interface WeaknessDetailedAnalysisSummary {
  id: string;
  analysis_id: string;
  grammar_score: number;
  grammar_description: string;
  grammar_examples: string;
  vocabulary_score: number;
  vocabulary_description: string;
  vocabulary_examples: string;
  expression_score: number;
  expression_description: string;
  expression_examples: string;
  structure_score: number;
  structure_description: string;
  structure_examples: string;
}

// 学習アドバイスサマリーの型定義
export interface WeaknessLearningAdviceSummary {
  id: string;
  analysis_id: string;
  learning_advice: string;
  recommended_actions: string;
  next_goals: string;
  study_plan: string;
  motivational_message: string;
}

// 弱点分析全体レスポンスの型定義
export interface WeaknessAnalysisResponse {
  weakness_analysis_summary: WeaknessAnalysisSummary;
  weakness_category_analysis_summary: WeaknessCategoryAnalysisSummary[];
  weakness_detailed_analysis_summary: WeaknessDetailedAnalysisSummary;
  weakness_learning_advice_summary: WeaknessLearningAdviceSummary;
}

// プロジェクトの弱点分析結果を取得するAPI
export const getWeaknessAnalysis = async (projectId: string): Promise<WeaknessAnalysisResponse> => {
  const response = await apiClient.get<WeaknessAnalysisResponse>(`/weakness-analysis/all-summary/${projectId}`);
  return response.data;
};

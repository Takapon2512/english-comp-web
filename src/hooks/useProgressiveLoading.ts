import { useState, useCallback } from 'react';

interface ProgressStep {
  name: string;
  progress: number;
  message: string;
}

export function useProgressiveLoading() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');

  const steps: ProgressStep[] = [
    { name: 'auth', progress: 10, message: '認証中...' },
    { name: 'project', progress: 40, message: 'プロジェクト情報を取得中...' },
    { name: 'results', progress: 80, message: '添削結果を読み込み中...' },
    { name: 'complete', progress: 100, message: '完了' }
  ];

  const setStep = useCallback((stepName: string) => {
    const step = steps.find(s => s.name === stepName);
    if (step) {
      setProgress(step.progress);
      setCurrentStep(step.message);
    }
  }, []);

  const incrementProgress = useCallback((amount: number) => {
    setProgress(prev => Math.min(100, prev + amount));
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setCurrentStep('');
  }, []);

  return {
    progress,
    currentStep,
    setStep,
    incrementProgress,
    reset
  };
}

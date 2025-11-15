'use client';

import { useState } from 'react';
import { ZodError } from 'zod';
import { Input, Button } from './ui';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { loginApi, type LoginResponse } from '@/lib/api';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  onSuccess?: (response: LoginResponse) => void;
}

export const LoginForm = ({ onSubmit, onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof LoginFormData;
          if (field) {
            newErrors[field] = issue.message;
          }
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');
    
    try {
      const formData: LoginFormData = { email, password };
      
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // デフォルトの処理：APIを直接呼び出し
        const response = await loginApi(formData);
        console.log('Login successful:', response);
        
        // 成功時のコールバックを実行
        if (onSuccess) {
          onSuccess(response);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {apiError}
        </div>
      )}
      
      <Input
        label="メールアドレス"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your-email@example.com"
        error={errors.email}
      />

      <Input
        label="パスワード"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力してください"
        error={errors.password}
      />

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <a 
            href="#" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            パスワードを忘れた場合
          </a>
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  );
};

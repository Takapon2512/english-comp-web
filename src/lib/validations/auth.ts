import { z } from 'zod';

// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスが長すぎます'),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(6, 'パスワードは6文字以上で入力してください')
    .max(100, 'パスワードが長すぎます'),
});

// ログインフォームの型定義
export type LoginFormData = z.infer<typeof loginSchema>;

// 新規登録フォームのバリデーションスキーマ（将来の拡張用）
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .min(2, '名前は2文字以上で入力してください')
    .max(50, '名前が長すぎます'),
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスが長すぎます'),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, 'パスワードが長すぎます')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは大文字、小文字、数字を含む必要があります'
    ),
  confirmPassword: z
    .string()
    .min(1, 'パスワード確認は必須です'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// 新規登録フォームの型定義
export type RegisterFormData = z.infer<typeof registerSchema>;

// パスワードリセットフォームのバリデーションスキーマ（将来の拡張用）
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスが長すぎます'),
});

// パスワードリセットフォームの型定義
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

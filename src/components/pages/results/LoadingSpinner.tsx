interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = "読み込み中..." }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">{text}</span>
    </div>
  );
}

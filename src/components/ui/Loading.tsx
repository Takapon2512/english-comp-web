import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse' | 'skeleton' | 'wave' | 'gradient' | 'orbit';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'gradient' | 'modern';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-orange-500',
    secondary: 'text-slate-500',
    white: 'text-white',
    gray: 'text-gray-400',
    gradient: 'text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text',
    modern: 'text-orange-500'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        {/* 背景リング */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        {/* アニメーションリング */}
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${colorClasses[color]} animate-spin`}></div>
        {/* 中央のドット */}
        <div className={`absolute inset-2 rounded-full ${colorClasses[color]} bg-current opacity-20 animate-pulse`}></div>
      </div>
    </div>
  );

  const renderDots = () => {
    const dotSize = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-5 h-5'
    };

    return (
      <div className="flex space-x-1.5">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${dotSize[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse shadow-sm`}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderBars = () => {
    const barWidth = {
      sm: 'w-0.5',
      md: 'w-1',
      lg: 'w-1.5',
      xl: 'w-2'
    };

    const barHeight = {
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12'
    };

    return (
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`${barWidth[size]} ${barHeight[size]} ${colorClasses[color]} bg-current animate-pulse`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderPulse = () => {
    const pulseSize = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };

    return (
      <div className="relative">
        <div
          className={`${pulseSize[size]} ${colorClasses[color]} bg-current rounded-full animate-ping opacity-40`}
        />
        <div
          className={`absolute inset-0 ${pulseSize[size]} ${colorClasses[color]} bg-current rounded-full animate-pulse opacity-80 shadow-lg`}
        />
      </div>
    );
  };

  const renderSkeleton = () => {
    const skeletonHeight = {
      sm: 'h-3',
      md: 'h-4',
      lg: 'h-5',
      xl: 'h-6'
    };

    return (
      <div className="space-y-3 w-full max-w-sm">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${skeletonHeight[size]} bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse`}
            style={{
              width: `${100 - index * 15}%`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderWave = () => {
    const waveHeight = {
      sm: 'h-6',
      md: 'h-8',
      lg: 'h-10',
      xl: 'h-12'
    };

    return (
      <div className={`flex items-end space-x-1 ${waveHeight[size]}`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`w-1 ${colorClasses[color]} bg-current rounded-full animate-pulse`}
            style={{
              height: `${20 + (index % 3) * 20}%`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderGradient = () => {
    return (
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-full`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-spin" />
        <div className="absolute inset-1 bg-white rounded-full" />
        <div className="absolute inset-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full animate-pulse" />
      </div>
    );
  };

  const renderOrbit = () => {
    const orbitSize = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };

    return (
      <div className={`${orbitSize[size]} relative`}>
        <div className={`absolute inset-0 rounded-full border-2 border-gray-200`} />
        <div
          className={`absolute top-0 left-1/2 w-2 h-2 ${colorClasses[color]} bg-current rounded-full animate-spin shadow-lg`}
          style={{
            transformOrigin: '0 50%',
            transform: 'translateX(-50%)',
            animationDuration: '1s'
          }}
        />
        <div
          className={`absolute top-1/2 left-0 w-1.5 h-1.5 ${colorClasses[color]} bg-current rounded-full animate-spin shadow-md opacity-60`}
          style={{
            transformOrigin: '100% 0',
            animationDuration: '2s',
            animationDirection: 'reverse'
          }}
        />
      </div>
    );
  };

  const renderLoadingIcon = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'wave':
        return renderWave();
      case 'gradient':
        return renderGradient();
      case 'orbit':
        return renderOrbit();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderLoadingIcon()}
      {text && (
        <p className={`${textSizeClasses[size]} ${colorClasses[color]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// プログレスバーコンポーネント
interface ProgressBarProps {
  progress: number; // 0-100の値
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'gradient' | 'modern';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

// プログレスバー
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    primary: 'bg-orange-500',
    secondary: 'bg-slate-500',
    gradient: 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600',
    modern: 'bg-orange-500'
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">進行状況</span>
          <span className="text-sm font-bold text-orange-600">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out relative overflow-hidden ${colorClasses[color]}`}
          style={{ 
            width: `${clampedProgress}%`,
            minWidth: clampedProgress > 0 ? '8px' : '0px' // 最小幅を設定
          }}
        >
          {/* プログレスバーのシャイン効果 */}
          {animated && clampedProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
      {/* プログレス状況のテキスト表示 */}
      {clampedProgress >= 0 && (
        <div className="text-xs text-gray-500 text-center">
          {clampedProgress < 10 && "認証中..."}
          {clampedProgress >= 10 && clampedProgress < 40 && "プロジェクト情報を取得中..."}
          {clampedProgress >= 40 && clampedProgress < 90 && "添削結果を読み込み中..."}
          {clampedProgress >= 90 && clampedProgress < 100 && "データを処理中..."}
          {clampedProgress >= 100 && "完了"}
        </div>
      )}
    </div>
  );
};

// フルスクリーンローディングコンポーネント
interface FullScreenLoadingProps {
  variant?: LoadingProps['variant'];
  size?: LoadingProps['size'];
  text?: string;
  overlay?: boolean;
  // プログレスバー関連のプロパティ
  showProgress?: boolean;
  progress?: number;
  progressText?: string;
  progressColor?: ProgressBarProps['color'];
}

// フルスクリーンローディング
export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  variant = 'gradient',
  text = '読み込み中...',
  overlay = true,
  showProgress = false,
  progress = 0,
  progressText,
}) => {
  const baseClasses = 'fixed inset-0 flex items-center justify-center z-50';
  const overlayClasses = overlay 
    ? 'bg-white/80 backdrop-blur-sm' 
    : 'bg-gradient-to-br from-slate-50 to-slate-100';

  return (
    <div className={`${baseClasses} ${overlayClasses}`}>
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-orange-100/50 max-w-md w-full mx-4">
        {showProgress ? (
          <div className="space-y-6">
            {/* プログレスバー表示 */}
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"
                    style={{ 
                      animationDuration: '1s',
                      transform: `rotate(${(progress / 100) * 360}deg)`
                    }}
                  ></div>
                  <div className="absolute inset-2 rounded-full bg-orange-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {text}
              </h3>
              {progressText && (
                <p className="text-sm text-gray-600 mb-4">
                  {progressText}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <Loading
                variant={variant}
                size="xl"
                color="modern"
                className="items-center"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {text}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

// インラインローディングコンポーネント
interface InlineLoadingProps {
  variant?: LoadingProps['variant'];
  size?: LoadingProps['size'];
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  variant = 'dots',
  size = 'sm',
  text
}) => {
  return (
    <div className="flex items-center space-x-3">
      <Loading
        variant={variant}
        size={size}
        color="modern"
      />
      {text && (
        <span className="text-sm text-slate-600 font-medium">{text}</span>
      )}
    </div>
  );
};

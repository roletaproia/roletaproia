import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function ConfidenceIndicator({ 
  confidence, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ConfidenceIndicatorProps) {
  
  // Determinar cor e ícone baseado na confiança
  const { color, bgColor, borderColor, icon, label } = useMemo(() => {
    if (confidence >= 80) {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-500',
        icon: TrendingUp,
        label: 'Alta Confiança'
      };
    } else if (confidence >= 60) {
      return {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/30',
        borderColor: 'border-yellow-500',
        icon: Minus,
        label: 'Média Confiança'
      };
    } else {
      return {
        color: 'text-red-400',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-500',
        icon: TrendingDown,
        label: 'Baixa Confiança'
      };
    }
  }, [confidence]);

  const Icon = icon;

  // Tamanhos
  const sizes = {
    sm: {
      container: 'w-16 h-16',
      text: 'text-sm',
      icon: 'w-4 h-4',
      stroke: 4,
      labelText: 'text-xs'
    },
    md: {
      container: 'w-24 h-24',
      text: 'text-xl',
      icon: 'w-5 h-5',
      stroke: 6,
      labelText: 'text-sm'
    },
    lg: {
      container: 'w-32 h-32',
      text: 'text-2xl',
      icon: 'w-6 h-6',
      stroke: 8,
      labelText: 'text-base'
    }
  };

  const sizeClasses = sizes[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* SVG Circle Progress */}
        <svg className={sizeClasses.container} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={sizeClasses.stroke}
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeClasses.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className={`${color} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          />
        </svg>
        
        {/* Content inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`${sizeClasses.icon} ${color} mb-1`} />
          <span className={`${sizeClasses.text} font-bold ${color}`}>
            {confidence}%
          </span>
        </div>
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className={`px-3 py-1 rounded-full ${bgColor} border ${borderColor}`}>
          <span className={`${sizeClasses.labelText} font-medium ${color}`}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

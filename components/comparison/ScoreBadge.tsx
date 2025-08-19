interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function ScoreBadge({ score, maxScore = 10, className = '' }: ScoreBadgeProps) {
  const percentage = (score / maxScore) * 100;
  
  let bgColor = 'bg-gray-500';
  const textColor = 'text-white';
  
  if (percentage >= 90) {
    bgColor = 'bg-green-500';
  } else if (percentage >= 80) {
    bgColor = 'bg-blue-500';
  } else if (percentage >= 70) {
    bgColor = 'bg-yellow-500';
  } else if (percentage >= 60) {
    bgColor = 'bg-orange-500';
  } else {
    bgColor = 'bg-red-500';
  }

  return (
    <div 
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-white shadow-sm ${bgColor} ${textColor} font-semibold text-sm ${className}`}
      aria-label={`Score: ${score} out of ${maxScore}`}
    >
      {score}
    </div>
  );
}

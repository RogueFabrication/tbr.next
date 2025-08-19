interface Scores {
  buildQuality: number;
  precision: number;
  easeOfUse: number;
  value: number;
  durability: number;
}

interface ScoreBreakdownProps {
  scores: Scores;
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const scoreItems = [
    { label: 'Build Quality', score: scores.buildQuality, color: 'bg-blue-500' },
    { label: 'Precision', score: scores.precision, color: 'bg-green-500' },
    { label: 'Ease of Use', score: scores.easeOfUse, color: 'bg-yellow-500' },
    { label: 'Value', score: scores.value, color: 'bg-purple-500' },
    { label: 'Durability', score: scores.durability, color: 'bg-red-500' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Score Breakdown</h2>
      
      <div className="space-y-6">
        {scoreItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getScoreColor(item.score)}`}>
                  {item.score}/10
                </span>
                <span className="text-sm text-gray-500">
                  {getScoreLabel(item.score)}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${(item.score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">How We Score</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">9-10:</span> Excellent - Outstanding performance
          </div>
          <div>
            <span className="font-medium">8-8.9:</span> Very Good - Above average quality
          </div>
          <div>
            <span className="font-medium">7-7.9:</span> Good - Meets expectations
          </div>
          <div>
            <span className="font-medium">6-6.9:</span> Fair - Below average
          </div>
        </div>
      </div>
    </div>
  );
}


import { useMemo } from "react";

interface TrustScoreGaugeProps {
  score: number;
  size?: "small" | "medium" | "large";
}

const TrustScoreGauge = ({ score, size = "medium" }: TrustScoreGaugeProps) => {
  const dashArray = useMemo(() => {
    // Calculate the circumference
    const circumference = 2 * Math.PI * 15.9155;
    
    // Calculate the dash array for the progress arc
    const dashArray = `${(score / 100) * circumference}, ${circumference}`;
    
    return dashArray;
  }, [score]);
  
  const getColor = (score: number) => {
    if (score >= 70) return "#2E7D32"; // Trust green
    if (score >= 40) return "#FFA000"; // Medium risk orange
    return "#C62828"; // Warning red
  };
  
  const getTrustLevel = (score: number) => {
    if (score >= 70) return "Trustworthy";
    if (score >= 40) return "Caution";
    return "Suspicious";
  };
  
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-40 h-40",
  };
  
  const textSizeClasses = {
    small: "text-xl",
    medium: "text-3xl",
    large: "text-4xl",
  };
  
  const subTextSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <h3 className="font-roboto font-medium mb-2">Trust Score</h3>
      <div className="relative inline-flex items-center justify-center">
        <svg className={sizeClasses[size]} viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="3"
            strokeDasharray={dashArray}
          />
        </svg>
        <div className="absolute">
          <div className={`${textSizeClasses[size]} font-bold`}>{score}%</div>
          <div className={`${subTextSizeClasses[size]} text-gray-500`}>{getTrustLevel(score)}</div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreGauge;

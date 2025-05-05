import { useMemo } from "react";

interface CommunityRatingsProps {
  safePercentage: number;
  suspiciousPercentage: number;
  dangerousPercentage: number;
  totalReviews: number;
}

const CommunityRatings = ({
  safePercentage,
  suspiciousPercentage,
  dangerousPercentage,
  totalReviews
}: CommunityRatingsProps) => {
  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat().format(totalReviews);
  }, [totalReviews]);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-roboto font-medium mb-3">Community Ratings</h3>
      
      {totalReviews > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-24 text-sm">Safe</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-trust-green h-2.5 rounded-full"
                style={{ width: `${safePercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm">{safePercentage}%</span>
          </div>
          
          <div className="flex items-center">
            <span className="w-24 text-sm">Suspicious</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-medium-risk h-2.5 rounded-full"
                style={{ width: `${suspiciousPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm">{suspiciousPercentage}%</span>
          </div>
          
          <div className="flex items-center">
            <span className="w-24 text-sm">Dangerous</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-warning-red h-2.5 rounded-full"
                style={{ width: `${dangerousPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm">{dangerousPercentage}%</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No community ratings yet</p>
        </div>
      )}
      
      <p className="mt-3 text-sm text-gray-500">
        Based on {formattedTotal} user {totalReviews === 1 ? 'review' : 'reviews'}
      </p>
    </div>
  );
};

export default CommunityRatings;

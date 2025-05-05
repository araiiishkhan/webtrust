import { useState } from "react";
import { Website } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewForm from "./ReviewForm";
import { Check, XCircle, AlertCircle } from "lucide-react";

interface DetailedAnalysisProps {
  website: Website;
  reviews: any[];
  websiteId: number;
  onReviewAdded: () => void;
}

const DetailedAnalysis = ({ website, reviews, websiteId, onReviewAdded }: DetailedAnalysisProps) => {
  const [activeTab, setActiveTab] = useState("technical");

  const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return "Invalid date";
    }
  };

  const getRiskBadge = (risk: string | null | undefined) => {
    if (!risk || risk === "unknown") return null;
    
    const riskColors = {
      low: "bg-low-risk",
      medium: "bg-medium-risk",
      high: "bg-warning-red",
      clean: "bg-trust-green",
    };
    
    const colorClass = riskColors[risk as keyof typeof riskColors] || "bg-gray-500";
    
    return (
      <span className={`px-2 py-1 ${colorClass} text-white text-xs font-medium rounded-full`}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger 
              value="technical"
              className={activeTab === "technical" ? "border-b-2 border-trust-green text-trust-green" : "border-b-2 border-transparent"}
            >
              Technical Details
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className={activeTab === "reviews" ? "border-b-2 border-trust-green text-trust-green" : "border-b-2 border-transparent"}
            >
              User Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className={activeTab === "security" ? "border-b-2 border-trust-green text-trust-green" : "border-b-2 border-transparent"}
            >
              Security Report
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="technical" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-roboto font-medium mb-4">Domain Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Domain Name</span>
                  <span className="font-medium">{website.domain}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Registration Date</span>
                  <span className="font-medium">{formatDate(website.registrationDate)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatDate(website.lastAnalyzed)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Expiration Date</span>
                  <span className="font-medium">{formatDate(website.expirationDate)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Registrar</span>
                  <span className="font-medium">{website.registrar || "Unknown"}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-roboto font-medium mb-4">SSL Certificate</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Secure Connection</span>
                  <div className="flex items-center">
                    {website.hasValidSSL ? (
                      <>
                        <Check className="h-5 w-5 text-trust-green mr-1" />
                        <span className="font-medium">Valid (HTTPS)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-warning-red mr-1" />
                        <span className="font-medium">Invalid or Missing</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Issuer</span>
                  <span className="font-medium">{website.sslIssuer || "Unknown"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Valid From</span>
                  <span className="font-medium">{formatDate(website.sslValidFrom)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Valid Until</span>
                  <span className="font-medium">{formatDate(website.sslValidTo)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Encryption</span>
                  <span className="font-medium">
                    {(website.technicalDetails as Record<string, string> | null)?.encryption || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-roboto font-medium mb-4">Server Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Server Type</span>
                  <span className="font-medium">{website.serverType || "Unknown"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{website.serverLocation || "Unknown"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">IP Address</span>
                  <span className="font-medium">{website.ipAddress || "Unknown"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Hosting Provider</span>
                  <span className="font-medium">{website.hostingProvider || "Unknown"}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-roboto font-medium mb-4">Security Assessment</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phishing Risk</span>
                  {getRiskBadge(website.phishingRisk)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Malware Risk</span>
                  {getRiskBadge(website.malwareRisk)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Scam Risk</span>
                  {getRiskBadge(website.scamRisk)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Blacklist Status</span>
                  {getRiskBadge(website.blacklistStatus)}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-roboto font-medium mb-4">Add Your Review</h3>
            <ReviewForm websiteId={websiteId} onReviewAdded={onReviewAdded} />
          </div>
          
          <div>
            <h3 className="text-xl font-roboto font-medium mb-4">Community Reviews</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="text-trust-green font-medium">
                          {review.isAnonymous ? "Anonymous User" : review.user?.username || "Anonymous"}
                        </div>
                        <div className="ml-2 text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <div className="bg-gray-200 px-2 py-1 rounded text-sm">
                        Rating: {review.rating}/5
                      </div>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reviews yet. Be the first to review this website!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="p-6">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-roboto font-medium mb-4">Security Summary</h3>
            <p className="mb-4">
              Our security analysis looks at multiple factors to determine the risk level of {website.domain}:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>
                <span className="font-medium">Domain Age:</span>{" "}
                {website.domainAge
                  ? `${Math.floor(website.domainAge / 365)} years, ${Math.floor((website.domainAge % 365) / 30)} months`
                  : "Unknown"}
                {website.domainAge && website.domainAge > 365 * 2 && " (Positive trust signal)"}
                {website.domainAge && website.domainAge < 180 && " (Potential risk factor)"}
              </li>
              <li>
                <span className="font-medium">SSL Certificate:</span>{" "}
                {website.hasValidSSL ? "Valid and secure" : "Invalid or missing"} 
                {website.hasValidSSL && " (Positive trust signal)"}
                {!website.hasValidSSL && " (Major risk factor)"}
              </li>
              <li>
                <span className="font-medium">Malware Detection:</span>{" "}
                {website.malwareDetected ? "Malware detected" : "No malware detected"}
                {!website.malwareDetected && " (Positive trust signal)"}
                {website.malwareDetected && " (Critical risk factor)"}
              </li>
              <li>
                <span className="font-medium">Blacklist Status:</span>{" "}
                {website.blacklistStatus === "clean" ? "Not blacklisted" : website.blacklistStatus || "Unknown"}
                {website.blacklistStatus === "clean" && " (Positive trust signal)"}
                {website.blacklistStatus !== "clean" && website.blacklistStatus !== "unknown" && " (Major risk factor)"}
              </li>
            </ul>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                {website.trustScore >= 70 ? (
                  <Check className="h-5 w-5 text-trust-green mr-2 mt-0.5" />
                ) : website.trustScore >= 40 ? (
                  <AlertCircle className="h-5 w-5 text-medium-risk mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-warning-red mr-2 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">Summary Assessment</h4>
                  <p>
                    {website.trustScore >= 70
                      ? `${website.domain} appears to be a legitimate and trustworthy website.`
                      : website.trustScore >= 40
                      ? `${website.domain} has some risk factors. Exercise caution when using this site.`
                      : `${website.domain} has significant red flags. Visiting this site may be risky.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-roboto font-medium mb-4">Recommendations</h3>
            
            {website.trustScore >= 70 ? (
              <div>
                <p className="mb-4">This website appears to be safe, but you should always:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verify that you're on the correct domain before entering personal information.</li>
                  <li>Use strong, unique passwords for any accounts you create.</li>
                  <li>Be cautious about sharing sensitive personal or financial information.</li>
                </ul>
              </div>
            ) : website.trustScore >= 40 ? (
              <div>
                <p className="mb-4">Exercise caution when using this website:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Avoid entering sensitive information like credit card details or passwords.</li>
                  <li>Consider using a temporary email address for registration.</li>
                  <li>Be alert for suspicious behavior, pop-ups, or redirects.</li>
                  <li>Use a browser with built-in security features.</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="mb-4">This website shows significant risk factors:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We recommend avoiding this website entirely.</li>
                  <li>Do not enter any personal information or download any files.</li>
                  <li>If you've already visited, consider scanning your device for malware.</li>
                  <li>If you've entered credentials, change those passwords immediately on secure devices.</li>
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAnalysis;

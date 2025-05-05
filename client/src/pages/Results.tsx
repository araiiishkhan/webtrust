import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/SearchBar";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import CommunityRatings from "@/components/CommunityRatings";
import KeyTrustSignals from "@/components/KeyTrustSignals";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import SimpleAdBanner from "@/components/SimpleAdBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { TrustSignal } from "@/components/KeyTrustSignals";

const Results = () => {
  const { domain } = useParams();
  const decodedDomain = decodeURIComponent(domain || "");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // The analyze mutation for fresh analysis
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/analyze", { url: decodedDomain });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/websites/${decodedDomain}`] });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: `Unable to analyze ${decodedDomain}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Fetch website data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`/api/websites/${decodedDomain}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/websites/${decodedDomain}`);
        if (!res.ok) {
          if (res.status === 404) {
            // Website not found, trigger analysis
            const analyzeRes = await analyzeMutation.mutateAsync();
            return await analyzeRes.json();
          }
          throw new Error(`Server responded with ${res.status}`);
        }
        return await res.json();
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error("An unknown error occurred");
      }
    },
  });

  // Fetch reviews for the website
  const { 
    data: reviewsData, 
    isLoading: isLoadingReviews,
    refetch: refetchReviews 
  } = useQuery({
    queryKey: [`/api/websites/${data?.website?.id}/reviews`],
    queryFn: async () => {
      if (!data?.website?.id) return { reviews: [] };
      const res = await fetch(`/api/websites/${data.website.id}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    enabled: !!data?.website?.id,
  });

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load website data",
        variant: "destructive",
      });
      
      // Navigate back to home if there's a serious error
      if (error instanceof Error && error.message.includes("404")) {
        setLocation("/");
      }
    }
  }, [isError, error, toast, setLocation]);

  // Generate trust signals based on website data
  const generateTrustSignals = (): TrustSignal[] => {
    if (!data?.website) return [];
    
    const signals: TrustSignal[] = [];
    
    // SSL Certificate
    signals.push({
      name: data.website.hasValidSSL ? "Valid SSL Certificate" : "Invalid or Missing SSL",
      status: data.website.hasValidSSL ? "positive" : "negative"
    });
    
    // Domain Age
    if (data.website.domainAge) {
      const years = Math.floor(data.website.domainAge / 365);
      signals.push({
        name: `Domain Age: ${years} ${years === 1 ? 'year' : 'years'}`,
        status: years >= 2 ? "positive" : years >= 1 ? "warning" : "negative"
      });
    }
    
    // Malware
    signals.push({
      name: data.website.malwareDetected ? "Malware Detected" : "No Malware Detected",
      status: data.website.malwareDetected ? "negative" : "positive"
    });
    
    // HTTPS
    signals.push({
      name: "HTTPS Encryption",
      status: data.website.hasValidSSL ? "positive" : "negative"
    });
    
    return signals;
  };

  // Get safety status based on overall trust score
  const getSafetyStatus = () => {
    if (!data?.overallTrustScore) return null;
    
    if (data.overallTrustScore >= 70) {
      return <span className="px-3 py-1 bg-trust-green text-white text-sm font-medium rounded-full">Safe</span>;
    } else if (data.overallTrustScore >= 40) {
      return <span className="px-3 py-1 bg-medium-risk text-white text-sm font-medium rounded-full">Caution</span>;
    } else {
      return <span className="px-3 py-1 bg-warning-red text-white text-sm font-medium rounded-full">Suspicious</span>;
    }
  };
  
  // Format date to display
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ad Container */}
        <div className="mb-8">
          <SimpleAdBanner />
        </div>
        
        {/* Search Bar for new search */}
        <div className="mb-8">
          <SearchBar />
        </div>
        
        {isLoading ? (
          // Loading state
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="h-7 w-48 bg-gray-200 rounded mr-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 h-64"></div>
                <div className="bg-gray-50 rounded-lg p-4 h-64"></div>
                <div className="bg-gray-50 rounded-lg p-4 h-64"></div>
              </div>
            </div>
          </div>
        ) : data?.website ? (
          <>
            {/* Trust Score Overview Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold font-roboto mr-2">{data.website.domain}</h2>
                  {getSafetyStatus()}
                </div>
                <div className="text-sm text-gray-500">
                  Analysis completed on {formatDate(data.website.lastAnalyzed)}
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trust Score Gauge */}
                <TrustScoreGauge score={data.overallTrustScore || data.website.trustScore} />
                
                {/* Community Ratings */}
                <CommunityRatings
                  safePercentage={data.reviewStats?.safePercentage || 0}
                  suspiciousPercentage={data.reviewStats?.suspiciousPercentage || 0}
                  dangerousPercentage={data.reviewStats?.dangerousPercentage || 0}
                  totalReviews={data.reviewStats?.total || 0}
                />
                
                {/* Key Trust Signals */}
                <KeyTrustSignals signals={generateTrustSignals()} />
              </div>
            </div>
            
            {/* Detailed Analysis Tabs */}
            <DetailedAnalysis
              website={data.website}
              reviews={reviewsData?.reviews || []}
              websiteId={data.website.id}
              onReviewAdded={refetchReviews}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
            <h2 className="text-xl font-medium mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any information for the domain: {decodedDomain}
            </p>
            <button
              onClick={() => analyzeMutation.mutate()}
              className="bg-trust-green hover:bg-trust-green/90 text-white px-4 py-2 rounded-md"
              disabled={analyzeMutation.isPending}
            >
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze Now"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;

import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import BlogCard from "@/components/BlogCard";
import FeatureCard from "@/components/FeatureCard";
import SimpleAdBanner from "@/components/SimpleAdBanner";
import { Shield, FileBarChart, Users } from "lucide-react";

const Home = () => {
  // Fetch latest blog posts
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      // Limit to 3 posts for the homepage
      const response = await fetch("/api/blog?limit=3");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  return (
    <div>
      {/* Ad Container */}
      <SimpleAdBanner />
      
      {/* Hero Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-roboto mb-4">
              Check Website Reputation & Safety
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Analyze any website for potential security issues, scams, and overall trustworthiness before you share your information.
            </p>
            
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        {/* Ad Banner above Features Section */}
        <div className="mb-10">
          <SimpleAdBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-roboto mb-4">
              How WebTrust Protects You Online
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced website analysis tools help you identify potential threats before sharing your information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Comprehensive Analysis"
              description="We check domain age, SSL certificates, hosting details, and analyze multiple security databases to verify website legitimacy."
              iconColor="text-trust-green"
            />
            
            <FeatureCard
              icon={<FileBarChart className="h-10 w-10" />}
              title="Detailed Reports"
              description="Get clear, easy-to-understand reports that highlight potential risks and safety indicators for any website you analyze."
              iconColor="text-info-blue"
            />
            
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Community Insights"
              description="Benefit from our community of users who share their experiences and report suspicious websites to help protect others."
              iconColor="text-medium-risk"
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-roboto">Latest Safety Articles</h2>
            <Link href="/blog" className="text-info-blue hover:underline font-medium">
              View All Articles
            </Link>
          </div>
          
          {isBlogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="bg-gray-200 h-32 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogData?.posts && blogData.posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-trust-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-roboto mb-4">Stay Protected Online</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Check any website before you share your personal information, make purchases, or download files.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="https://www.profitableratecpm.com/u6qqhtef77?key=3647b8d8faeb4b879b90d8cfc0782dc5" className="bg-white text-trust-green hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md">
              Analyze a Website
            </a>
            <Link href="/blog" className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-lg font-medium">
              Learn About Online Safety
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

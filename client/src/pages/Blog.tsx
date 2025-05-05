import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/BlogCard";
import SimpleAdBanner from "@/components/SimpleAdBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  // Fetch all blog posts or search results
  const { data, isLoading } = useQuery({
    queryKey: [activeSearch ? `/api/blog/search/${activeSearch}` : "/api/blog"],
    queryFn: async () => {
      const url = activeSearch 
        ? `/api/blog/search/${encodeURIComponent(activeSearch)}`
        : "/api/blog";
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ad Banner */}
        <div className="mb-8">
          <SimpleAdBanner />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-4">
            Online Safety Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Latest articles and advice on staying safe online, avoiding scams, and protecting your digital identity.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-info-blue hover:bg-info-blue/90">
              Search
            </Button>
          </form>
        </div>
        
        {/* Active Search Indicator */}
        {activeSearch && (
          <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
            <div className="text-gray-600">
              Showing results for: <span className="font-medium">{activeSearch}</span>
            </div>
            <Button variant="ghost" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        )}
        
        {/* Blog Posts */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : data?.posts && data.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">No Posts Found</h3>
            {activeSearch ? (
              <p className="text-gray-600">
                No posts match your search for "{activeSearch}".{" "}
                <button
                  className="text-info-blue hover:underline"
                  onClick={clearSearch}
                >
                  View all posts instead.
                </button>
              </p>
            ) : (
              <p className="text-gray-600">Check back soon for new content!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleAdBanner from "@/components/SimpleAdBanner";

const BlogPost = () => {
  const { slug } = useParams();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/blog/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found");
        }
        throw new Error("Error fetching blog post");
      }
      return response.json();
    },
  });
  
  if (isLoading) {
    return (
      <div className="py-10 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !data?.post) {
    return (
      <div className="py-10 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog">
              <a className="text-info-blue hover:underline flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const { post } = data;
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
  
  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ad Banner */}
        <div className="mb-8">
          <SimpleAdBanner />
        </div>
        
        <Link href="/blog">
          <a className="text-info-blue hover:underline flex items-center mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </a>
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold font-roboto mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-500 mb-6">
              <div className="flex items-center mr-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author?.username || "Anonymous"}</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

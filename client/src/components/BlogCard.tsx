import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { type BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Format the date to show "x days/months/years ago"
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-2">{formattedDate}</div>
        <h3 className="text-xl font-bold font-roboto mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{post.summary}</p>
        <Link href={`/blog/${post.slug}`} className="text-info-blue hover:underline font-medium mt-auto inline-block">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;

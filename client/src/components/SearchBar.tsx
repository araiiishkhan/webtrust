import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// URL validation schema
const urlSchema = z.string().url("Please enter a valid URL").or(
  // More permissive regex that accepts subdomains, paths, and various domain patterns (including Netlify apps)
  z.string().regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\/?[\/\w\.-]*)*$/, "Please enter a valid domain")
);

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
}

const SearchBar = ({ defaultValue = "", large = false }: SearchBarProps) => {
  const [searchUrl, setSearchUrl] = useState(defaultValue);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate URL format
      urlSchema.parse(searchUrl);
      
      // Redirect to affiliate link
      window.location.href = "https://www.profitableratecpm.com/u6qqhtef77?key=3647b8d8faeb4b879b90d8cfc0782dc5";
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid website URL (e.g., example.com)",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={large ? "max-w-3xl mx-auto" : "w-full"}>
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden ${large ? "" : "max-w-xl"}`}>
          <input 
            type="text" 
            placeholder="Enter a website URL (e.g., example.com)" 
            className="flex-grow px-4 py-3 md:py-4 focus:outline-none text-text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-trust-green hover:bg-opacity-90 text-white px-6 py-3 md:py-4 font-medium"
          >
            Analyze
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">We analyze domains for safety signals and community feedback</p>
      </form>
    </div>
  );
};

export default SearchBar;

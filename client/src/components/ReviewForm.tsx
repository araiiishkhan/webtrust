import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(500, "Comment must not exceed 500 characters").optional(),
  isAnonymous: z.boolean().default(true),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  websiteId: number;
  onReviewAdded: () => void;
}

const ReviewForm = ({ websiteId, onReviewAdded }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      isAnonymous: true,
    },
  });
  
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const rating = form.watch("rating");

  const onSubmit = async (data: ReviewFormValues) => {
    if (data.rating === 0) {
      form.setError("rating", { message: "Please select a rating" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiRequest("POST", `/api/websites/${websiteId}/reviews`, data);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      form.reset({
        rating: 0,
        comment: "",
        isAnonymous: true,
      });
      
      // Notify parent component to refresh reviews
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => form.setValue("rating", star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 cursor-pointer ${
                (hoverRating !== null ? star <= hoverRating : star <= rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <div>
                    <input
                      type="hidden"
                      {...field}
                    />
                    {renderStars()}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Comment (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience with this website..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Post Anonymously</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="bg-trust-green hover:bg-trust-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;

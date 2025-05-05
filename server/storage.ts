import { db } from "@db";
import { eq, and, like, desc, sql } from "drizzle-orm";
import {
  websites,
  reviews,
  blogPosts,
  users,
  type Website,
  type Review,
  type BlogPost
} from "@shared/schema";

// Website related storage functions
export async function getWebsiteByDomain(domain: string): Promise<Website | undefined> {
  const result = await db.query.websites.findFirst({
    where: eq(websites.domain, domain),
  });
  return result;
}

export async function createWebsite(websiteData: Omit<Website, "id" | "lastAnalyzed">): Promise<Website> {
  const [website] = await db.insert(websites).values({
    ...websiteData,
    lastAnalyzed: new Date()
  }).returning();
  return website;
}

export async function updateWebsite(websiteId: number, websiteData: Partial<Omit<Website, "id">>): Promise<Website | undefined> {
  const [website] = await db.update(websites)
    .set({
      ...websiteData,
      lastAnalyzed: new Date()
    })
    .where(eq(websites.id, websiteId))
    .returning();
  return website;
}

// Review related storage functions
export async function getReviewsByWebsiteId(websiteId: number): Promise<Review[]> {
  return db.query.reviews.findMany({
    where: eq(reviews.websiteId, websiteId),
    orderBy: desc(reviews.createdAt),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        }
      }
    }
  });
}

export async function createReview(reviewData: Omit<Review, "id" | "createdAt"> & { userId?: number | null }): Promise<Review> {
  const [review] = await db.insert(reviews).values({
    ...reviewData,
    createdAt: new Date()
  }).returning();
  return review;
}

export async function getReviewStats(websiteId: number): Promise<{ total: number, safePercentage: number, suspiciousPercentage: number, dangerousPercentage: number }> {
  const allReviews = await db.query.reviews.findMany({
    where: eq(reviews.websiteId, websiteId),
  });
  
  const total = allReviews.length;
  
  if (total === 0) {
    return {
      total: 0,
      safePercentage: 0,
      suspiciousPercentage: 0,
      dangerousPercentage: 0
    };
  }
  
  // Define rating ranges: 4-5 = safe, 3 = suspicious, 1-2 = dangerous
  const safe = allReviews.filter(r => r.rating >= 4).length;
  const suspicious = allReviews.filter(r => r.rating === 3).length;
  const dangerous = allReviews.filter(r => r.rating <= 2).length;
  
  return {
    total,
    safePercentage: Math.round((safe / total) * 100),
    suspiciousPercentage: Math.round((suspicious / total) * 100),
    dangerousPercentage: Math.round((dangerous / total) * 100)
  };
}

// Blog related storage functions
export async function getAllBlogPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
  return db.query.blogPosts.findMany({
    orderBy: desc(blogPosts.publishedAt),
    limit,
    offset,
    with: {
      author: {
        columns: {
          id: true,
          username: true
        }
      }
    }
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
    with: {
      author: {
        columns: {
          id: true,
          username: true
        }
      }
    }
  });
}

export async function searchBlogPosts(query: string, limit = 10): Promise<BlogPost[]> {
  const searchTerm = `%${query}%`;
  return db.query.blogPosts.findMany({
    where: or(
      like(blogPosts.title, searchTerm),
      like(blogPosts.content, searchTerm),
      like(blogPosts.summary, searchTerm)
    ),
    orderBy: desc(blogPosts.publishedAt),
    limit,
    with: {
      author: {
        columns: {
          id: true,
          username: true
        }
      }
    }
  });
}

// Helper to create OR condition since it's not directly exported
function or(...conditions: unknown[]) {
  // @ts-ignore - this is a workaround for the OR operator
  return sql`(${conditions.join(' OR ')})`;
}

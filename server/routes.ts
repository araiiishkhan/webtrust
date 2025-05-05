import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import { analyzeDomain, calculateCommunityTrustScore, calculateOverallTrustScore } from "./services/analyzer-real";
import { z } from "zod";
import { insertReviewSchema } from "@shared/schema";

// URL validation schema
const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL").or(
    // More permissive regex that accepts subdomains, paths, and various domain patterns (including Netlify apps)
    z.string().regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\/?[\/\w\.-]*)*$/, "Please enter a valid domain")
  )
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints - prefix all routes with /api
  const apiPrefix = "/api";

  // WEBSITE ANALYSIS ENDPOINTS
  
  // Analyze a URL
  app.post(`${apiPrefix}/analyze`, async (req: Request, res: Response) => {
    try {
      console.log('Received URL analysis request:', req.body);
      // Validate the request body
      const { url } = urlSchema.parse(req.body);
      
      // Normalize the domain (remove http://, www., etc.)
      const domain = url.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // Check if we already have data for this domain
      console.log(`Looking up domain in database: ${domain}`);
      let website = await storage.getWebsiteByDomain(domain);
      console.log(`Database lookup result:`, website ? `Found (ID: ${website.id})` : 'Not found');
      
      // If website exists but analysis is older than 24 hours, refresh it
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      if (!website || (website.lastAnalyzed && new Date(website.lastAnalyzed) < oneDayAgo)) {
        // Analyze the domain
        console.log(`Starting domain analysis for: ${domain}`);
        const analysisResult = await analyzeDomain(domain);
        console.log(`Analysis result for ${domain}:`, JSON.stringify(analysisResult, null, 2));
        
        if (website) {
          // Update existing record
          console.log(`Updating existing website record for ${domain} (ID: ${website.id})`);
          website = await storage.updateWebsite(website.id, analysisResult);
        } else {
          // Create new record
          console.log(`Creating new website record for ${domain}`);
          website = await storage.createWebsite(analysisResult);
          console.log(`Created new record with ID: ${website?.id || 'unknown'}`);
        }
      } else {
        console.log(`Using existing recent analysis for ${domain} (ID: ${website.id})`);
      }
      
      if (!website) {
        return res.status(500).json({ message: "Failed to analyze website" });
      }
      
      // Get review stats
      const reviewStats = await storage.getReviewStats(website.id);
      
      // Calculate community trust score if we have reviews
      let communityTrustScore = null;
      if (reviewStats.total > 0) {
        communityTrustScore = calculateCommunityTrustScore(
          reviewStats.safePercentage,
          reviewStats.suspiciousPercentage,
          reviewStats.dangerousPercentage
        );
      }
      
      // Calculate overall trust score
      const overallTrustScore = calculateOverallTrustScore(
        website.trustScore,
        communityTrustScore,
        reviewStats.total
      );
      
      // Return the analysis result
      return res.status(200).json({
        website,
        reviewStats,
        communityTrustScore,
        overallTrustScore
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error analyzing URL:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get website by domain
  app.get(`${apiPrefix}/websites/:domain`, async (req: Request, res: Response) => {
    try {
      const domain = req.params.domain;
      const website = await storage.getWebsiteByDomain(domain);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Get review stats
      const reviewStats = await storage.getReviewStats(website.id);
      
      // Calculate community trust score if we have reviews
      let communityTrustScore = null;
      if (reviewStats.total > 0) {
        communityTrustScore = calculateCommunityTrustScore(
          reviewStats.safePercentage,
          reviewStats.suspiciousPercentage,
          reviewStats.dangerousPercentage
        );
      }
      
      // Calculate overall trust score
      const overallTrustScore = calculateOverallTrustScore(
        website.trustScore,
        communityTrustScore,
        reviewStats.total
      );
      
      return res.status(200).json({
        website,
        reviewStats,
        communityTrustScore,
        overallTrustScore
      });
    } catch (error) {
      console.error("Error getting website:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // REVIEW ENDPOINTS
  
  // Get reviews for a website
  app.get(`${apiPrefix}/websites/:websiteId/reviews`, async (req: Request, res: Response) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      if (isNaN(websiteId)) {
        return res.status(400).json({ message: "Invalid website ID" });
      }
      
      const reviews = await storage.getReviewsByWebsiteId(websiteId);
      return res.status(200).json({ reviews });
    } catch (error) {
      console.error("Error getting reviews:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Add a review for a website
  app.post(`${apiPrefix}/websites/:websiteId/reviews`, async (req: Request, res: Response) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      if (isNaN(websiteId)) {
        return res.status(400).json({ message: "Invalid website ID" });
      }
      
      // Validate the request body
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        websiteId
      });
      
      // Ensure userId is null instead of undefined
      const reviewData = {
        ...validatedData,
        userId: validatedData.userId || null,
        isAnonymous: validatedData.isAnonymous || true
      };
      
      // Create the review
      const review = await storage.createReview(reviewData);
      
      return res.status(201).json({ review });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating review:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // BLOG ENDPOINTS
  
  // Get all blog posts
  app.get(`${apiPrefix}/blog`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getAllBlogPosts(limit, offset);
      return res.status(200).json({ posts });
    } catch (error) {
      console.error("Error getting blog posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a blog post by slug
  app.get(`${apiPrefix}/blog/:slug`, async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(200).json({ post });
    } catch (error) {
      console.error("Error getting blog post:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Search blog posts
  app.get(`${apiPrefix}/blog/search/:query`, async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const posts = await storage.searchBlogPosts(query, limit);
      return res.status(200).json({ posts });
    } catch (error) {
      console.error("Error searching blog posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

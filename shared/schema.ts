import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Websites table to store analyzed websites
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  trustScore: integer("trust_score").notNull(),
  lastAnalyzed: timestamp("last_analyzed").defaultNow().notNull(),
  domainAge: integer("domain_age"), // in days
  registrationDate: timestamp("registration_date"),
  expirationDate: timestamp("expiration_date"),
  registrar: text("registrar"),
  hasValidSSL: boolean("has_valid_ssl"),
  sslIssuer: text("ssl_issuer"),
  sslValidFrom: timestamp("ssl_valid_from"),
  sslValidTo: timestamp("ssl_valid_to"),
  serverType: text("server_type"),
  serverLocation: text("server_location"),
  ipAddress: text("ip_address"),
  hostingProvider: text("hosting_provider"),
  malwareDetected: boolean("malware_detected").default(false),
  phishingRisk: text("phishing_risk").default("unknown"),
  malwareRisk: text("malware_risk").default("unknown"),
  scamRisk: text("scam_risk").default("unknown"),
  blacklistStatus: text("blacklist_status").default("unknown"),
  technicalDetails: jsonb("technical_details"),
});

export const insertWebsiteSchema = createInsertSchema(websites, {
  domain: (schema) => schema.min(4, "Domain must be at least 4 characters"),
  trustScore: (schema) => schema.min(0, "Trust score must be at least 0").max(100, "Trust score must not exceed 100"),
});

export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;

// Reviews table for user reviews of websites
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull().references(() => websites.id),
  userId: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 rating
  comment: text("comment"),
  isAnonymous: boolean("is_anonymous").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: (schema) => schema.min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: (schema) => schema.max(500, "Comment must not exceed 500 characters"),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  authorId: integer("author_id").references(() => users.id),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  title: (schema) => schema.min(5, "Title must be at least 5 characters"),
  slug: (schema) => schema.min(5, "Slug must be at least 5 characters"),
  content: (schema) => schema.min(50, "Content must be at least 50 characters"),
  summary: (schema) => schema.min(20, "Summary must be at least 20 characters"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Define relations
export const websitesRelations = relations(websites, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  website: one(websites, { fields: [reviews.websiteId], references: [websites.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));

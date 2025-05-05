import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if we already have data to avoid duplicates
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length === 0) {
      // Seed admin user
      console.log("Seeding users...");
      const [adminUser] = await db.insert(schema.users).values({
        username: "admin",
        password: "securePasswordHash", // In real app, this would be hashed
      }).returning();

      // Seed some analyzed websites
      console.log("Seeding websites...");
      const websitesToSeed = [
        {
          domain: "amazon.com",
          trustScore: 90,
          domainAge: 10220, // About 28 years in days
          registrationDate: new Date("1995-05-12"),
          expirationDate: new Date("2024-05-11"),
          registrar: "Amazon Registrar, Inc.",
          hasValidSSL: true,
          sslIssuer: "DigiCert Inc",
          sslValidFrom: new Date("2023-02-15"),
          sslValidTo: new Date("2024-02-14"),
          serverType: "Server/CloudFront",
          serverLocation: "United States",
          ipAddress: "176.32.103.205",
          hostingProvider: "Amazon AWS",
          malwareDetected: false,
          phishingRisk: "low",
          malwareRisk: "low",
          scamRisk: "low",
          blacklistStatus: "clean",
          technicalDetails: {
            encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
          }
        },
        {
          domain: "google.com",
          trustScore: 95,
          domainAge: 9125, // About 25 years in days
          registrationDate: new Date("1997-09-15"),
          expirationDate: new Date("2028-09-14"),
          registrar: "MarkMonitor Inc.",
          hasValidSSL: true,
          sslIssuer: "Google Trust Services LLC",
          sslValidFrom: new Date("2023-01-10"),
          sslValidTo: new Date("2024-01-09"),
          serverType: "gws",
          serverLocation: "United States",
          ipAddress: "142.250.190.78",
          hostingProvider: "Google LLC",
          malwareDetected: false,
          phishingRisk: "low",
          malwareRisk: "low",
          scamRisk: "low",
          blacklistStatus: "clean",
          technicalDetails: {
            encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
          }
        },
        {
          domain: "facebook.com",
          trustScore: 85,
          domainAge: 7300, // About 20 years in days
          registrationDate: new Date("2004-01-11"),
          expirationDate: new Date("2028-01-10"),
          registrar: "RegistrarSEC, LLC",
          hasValidSSL: true,
          sslIssuer: "DigiCert Inc",
          sslValidFrom: new Date("2023-03-10"),
          sslValidTo: new Date("2024-03-09"),
          serverType: "facebook-app",
          serverLocation: "United States",
          ipAddress: "31.13.72.36",
          hostingProvider: "Facebook, Inc.",
          malwareDetected: false,
          phishingRisk: "low",
          malwareRisk: "low",
          scamRisk: "low",
          blacklistStatus: "clean",
          technicalDetails: {
            encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
          }
        }
      ];

      for (const websiteData of websitesToSeed) {
        await db.insert(schema.websites).values(websiteData);
      }

      // Seed blog posts
      console.log("Seeding blog posts...");
      const blogPostsToSeed = [
        {
          title: "How to Identify Phishing Scams in 2023",
          slug: "how-to-identify-phishing-scams-2023",
          content: `
          <h2>Understanding Modern Phishing Attacks</h2>
          <p>Phishing attacks have become increasingly sophisticated in 2023. Attackers now use AI-generated content, deep fakes, and highly personalized information to trick users into revealing sensitive information.</p>
          
          <h2>Common Signs of Phishing Attempts</h2>
          <ul>
            <li>Urgent or threatening language demanding immediate action</li>
            <li>Requests for personal information or credentials</li>
            <li>Suspicious or misspelled domain names</li>
            <li>Poor grammar or spelling mistakes</li>
            <li>Unexpected attachments or links</li>
          </ul>
          
          <h2>Advanced Protection Techniques</h2>
          <p>Use multi-factor authentication whenever possible. Verify sender information by hovering over email addresses. Never click links directly - instead, manually navigate to the official website. Keep your security software updated.</p>
          
          <h2>What to Do If You Suspect a Phishing Attempt</h2>
          <p>Report the message to your IT department or the service being impersonated. Do not respond or engage with the sender. If you've already clicked on a link or provided information, immediately change your passwords and monitor your accounts for suspicious activity.</p>
          `,
          summary: "Learn the latest techniques used by scammers and how to protect yourself from sophisticated phishing attacks.",
          imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
          authorId: adminUser.id,
          publishedAt: new Date("2023-07-15")
        },
        {
          title: "Safe Online Shopping: What to Check Before You Buy",
          slug: "safe-online-shopping-checks",
          content: `
          <h2>Verify the Website's Legitimacy</h2>
          <p>Before making any purchase, ensure the website is legitimate. Look for https in the URL, check for a padlock symbol, and verify the domain name is correct. Be cautious of deals that seem too good to be true.</p>
          
          <h2>Research the Retailer</h2>
          <p>For unfamiliar online stores, conduct thorough research. Look for customer reviews on independent sites, check their social media presence, and search for any reported scams associated with the retailer.</p>
          
          <h2>Secure Payment Methods</h2>
          <p>Always use secure payment methods like credit cards or trusted payment processors that offer buyer protection. Avoid direct bank transfers or wire payments as these offer little recourse if something goes wrong.</p>
          
          <h2>Privacy Policy and Return Information</h2>
          <p>Legitimate retailers have clear privacy policies and return procedures. Check these before purchasing to understand how your data will be handled and what options you have if you're unhappy with your purchase.</p>
          
          <h2>Keep Records</h2>
          <p>Save all confirmation emails, order numbers, and screenshots of your purchase. These will be valuable if you need to follow up on an order or dispute a transaction.</p>
          `,
          summary: "Discover essential security checks to perform before making purchases from unfamiliar online retailers.",
          imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
          authorId: adminUser.id,
          publishedAt: new Date("2023-07-10")
        },
        {
          title: "Password Managers: Your First Line of Defense",
          slug: "password-managers-guide",
          content: `
          <h2>The Problem With Passwords</h2>
          <p>Most people use weak, reused passwords across multiple sites. This creates a significant security vulnerability - if one service is breached, attackers can access all your accounts using the same credentials.</p>
          
          <h2>How Password Managers Help</h2>
          <p>Password managers generate unique, complex passwords for each service you use while only requiring you to remember one master password. They encrypt your password database and can sync across devices for convenience.</p>
          
          <h2>Choosing the Right Password Manager</h2>
          <p>Look for features like strong encryption standards, two-factor authentication, secure password generation, auto-fill capabilities, and cross-platform support. Consider whether you need cloud synchronization or prefer local storage only.</p>
          
          <h2>Best Practices When Using Password Managers</h2>
          <ul>
            <li>Create a strong, memorable master password</li>
            <li>Enable two-factor authentication</li>
            <li>Regularly update your password manager</li>
            <li>Perform periodic security audits of your passwords</li>
            <li>Keep offline backups of your password database</li>
          </ul>
          
          <h2>Beyond Password Managers</h2>
          <p>While password managers are essential, combine them with other security practices like two-factor authentication, regular software updates, and being vigilant about phishing attempts for comprehensive protection.</p>
          `,
          summary: "Why using a password manager is essential for online security and how to choose the right one for your needs.",
          imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
          authorId: adminUser.id,
          publishedAt: new Date("2023-07-05")
        }
      ];

      for (const blogPostData of blogPostsToSeed) {
        await db.insert(schema.blogPosts).values(blogPostData);
      }

      // Seed some reviews
      console.log("Seeding website reviews...");
      const websites = await db.query.websites.findMany();
      
      if (websites.length > 0) {
        const amazonWebsite = websites.find(w => w.domain === "amazon.com");
        if (amazonWebsite) {
          const reviewsToSeed = [
            {
              websiteId: amazonWebsite.id,
              userId: adminUser.id,
              rating: 5,
              comment: "Reliable and secure e-commerce site with excellent buyer protection.",
              isAnonymous: false,
              createdAt: new Date("2023-06-10")
            },
            {
              websiteId: amazonWebsite.id,
              rating: 4,
              comment: "Generally trustworthy but be careful of third-party sellers.",
              isAnonymous: true,
              createdAt: new Date("2023-06-15")
            },
            {
              websiteId: amazonWebsite.id,
              rating: 5,
              comment: "Never had any security issues, always use secure payment methods.",
              isAnonymous: true,
              createdAt: new Date("2023-06-20")
            }
          ];

          for (const reviewData of reviewsToSeed) {
            await db.insert(schema.reviews).values(reviewData);
          }
        }
      }

      console.log("Seeding completed successfully!");
    } else {
      console.log("Database already has data, skipping seeding.");
    }
  } catch (error) {
    console.error("Error while seeding database:", error);
  }
}

seed();

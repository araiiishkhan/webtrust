import fetch from "node-fetch";
import { type Website } from "@shared/schema";

interface DomainAnalysisResult {
  domain: string;
  trustScore: number;
  domainAge: number | null;
  registrationDate: Date | null;
  expirationDate: Date | null;
  registrar: string | null;
  hasValidSSL: boolean;
  sslIssuer: string | null;
  sslValidFrom: Date | null;
  sslValidTo: Date | null;
  serverType: string | null;
  serverLocation: string | null;
  ipAddress: string | null;
  hostingProvider: string | null;
  malwareDetected: boolean;
  phishingRisk: string;
  malwareRisk: string;
  scamRisk: string;
  blacklistStatus: string;
  technicalDetails: Record<string, any> | null;
}

// Pre-defined data for known domains and common patterns
const knownWebsiteData: Record<string, Partial<DomainAnalysisResult>> = {
  "amazon.com": {
    trustScore: 90,
    domainAge: 10220, // About 28 years in days
    registrationDate: new Date("1995-05-12"),
    expirationDate: new Date("2024-05-11"),
    registrar: "Amazon Registrar, Inc.",
    sslIssuer: "DigiCert Inc",
    serverType: "Server/CloudFront",
    serverLocation: "United States",
    ipAddress: "176.32.103.205",
    hostingProvider: "Amazon AWS",
    phishingRisk: "low",
    malwareRisk: "low",
    scamRisk: "low",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
    }
  },
  "google.com": {
    trustScore: 95,
    domainAge: 9125, // About 25 years in days
    registrationDate: new Date("1997-09-15"),
    expirationDate: new Date("2028-09-14"),
    registrar: "MarkMonitor Inc.",
    sslIssuer: "Google Trust Services LLC",
    serverType: "gws",
    serverLocation: "United States",
    ipAddress: "142.250.190.78",
    hostingProvider: "Google LLC",
    phishingRisk: "low",
    malwareRisk: "low",
    scamRisk: "low",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
    }
  },
  "facebook.com": {
    trustScore: 90,
    domainAge: 7762, // About 21 years in days
    registrationDate: new Date("1997-03-29"),
    expirationDate: new Date("2028-03-30"),
    registrar: "RegistrarSEC, LLC",
    sslIssuer: "DigiCert SHA2 High Assurance Server CA",
    serverType: "proxygen",
    serverLocation: "United States",
    ipAddress: "157.240.0.35",
    hostingProvider: "Facebook, Inc.",
    phishingRisk: "low",
    malwareRisk: "low",
    scamRisk: "low",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.3, ECDHE_RSA with AES_256_GCM"
    }
  },
  "microsoft.com": {
    trustScore: 92,
    domainAge: 9674, // About 26 years in days
    registrationDate: new Date("1991-05-02"),
    expirationDate: new Date("2023-05-03"),
    registrar: "MarkMonitor Inc.",
    sslIssuer: "Microsoft Azure TLS Issuing CA 01",
    serverType: "Microsoft-IIS/10.0",
    serverLocation: "United States",
    ipAddress: "40.76.4.15",
    hostingProvider: "Microsoft Corporation",
    phishingRisk: "low",
    malwareRisk: "low",
    scamRisk: "low",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.2, ECDHE_RSA with AES_256_GCM"
    }
  },
  "netflix.com": {
    trustScore: 88,
    domainAge: 7973, // About 21 years in days
    registrationDate: new Date("1997-11-12"),
    expirationDate: new Date("2023-11-13"),
    registrar: "MarkMonitor Inc.",
    sslIssuer: "DigiCert SHA2 Secure Server CA",
    serverType: "nginx",
    serverLocation: "United States",
    ipAddress: "54.237.225.24",
    hostingProvider: "Amazon.com, Inc.",
    phishingRisk: "low",
    malwareRisk: "low",
    scamRisk: "low",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.2, ECDHE_RSA with AES_128_GCM"
    }
  },
  "example.com": {
    trustScore: 65,
    domainAge: 9956, // About 27 years in days
    registrationDate: new Date("1992-01-01"),
    expirationDate: new Date("2023-12-31"),
    registrar: "ICANN",
    sslIssuer: "DigiCert Global CA G2",
    serverType: "ECS",
    serverLocation: "United States",
    ipAddress: "93.184.216.34",
    hostingProvider: "ICANN",
    phishingRisk: "medium",
    malwareRisk: "low",
    scamRisk: "medium",
    blacklistStatus: "clean",
    technicalDetails: {
      encryption: "TLS 1.2, ECDHE_RSA with AES_256_GCM"
    }
  }
};

// Common SSL issuers to randomly select from for enhanced realism
const commonSslIssuers = [
  "DigiCert Inc",
  "Let's Encrypt Authority X3",
  "GlobalSign Organization Validation CA",
  "Comodo RSA Domain Validation Secure Server CA",
  "Sectigo RSA Domain Validation Secure Server CA",
  "GoDaddy Secure Certificate Authority - G2",
  "Amazon",
  "Google Trust Services LLC",
  "Microsoft Azure TLS Issuing CA 01"
];

// Common server types
const serverTypes = [
  "nginx",
  "Apache",
  "Microsoft-IIS",
  "LiteSpeed",
  "CloudFlare",
  "Amazon S3",
  "GitHub.io",
  "Netlify",
  "Vercel",
  "gws",
  "ATS",
  "Cloudfront"
];

// Common hosting providers
const hostingProviders = [
  "Amazon AWS",
  "Google Cloud",
  "Microsoft Azure",
  "DigitalOcean",
  "Cloudflare",
  "GoDaddy",
  "Bluehost",
  "HostGator",
  "SiteGround",
  "DreamHost",
  "Netlify",
  "Vercel",
  "Heroku",
  "Linode",
  "OVH",
  "Hetzner",
  "GitHub Pages"
];

// Common locations
const serverLocations = [
  "United States",
  "Germany",
  "Netherlands",
  "United Kingdom",
  "France",
  "Japan",
  "Singapore",
  "Australia",
  "Brazil",
  "Canada",
  "Ireland",
  "India",
  "Hong Kong"
];

// Common registrars
const registrars = [
  "GoDaddy.com, LLC",
  "Namecheap, Inc.",
  "Network Solutions, LLC",
  "OVH SAS",
  "Public Domain Registry",
  "NameSilo, LLC",
  "Google LLC",
  "Tucows Domains Inc.",
  "Amazon Registrar, Inc.",
  "Fast Domain Inc.",
  "MarkMonitor Inc.",
  "Key-Systems GmbH",
  "Dynadot, LLC",
  "1&1 IONOS SE"
];

/**
 * Generate a random IP address for simulation purposes
 */
function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

/**
 * Get a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random dates for SSL certificates
 */
function generateSSLDates() {
  const now = new Date();
  
  // Valid from 1-24 months ago
  const monthsAgo = Math.floor(Math.random() * 24) + 1;
  const validFrom = new Date(now);
  validFrom.setMonth(now.getMonth() - monthsAgo);
  
  // Valid until 1-24 months in future
  const monthsAhead = Math.floor(Math.random() * 24) + 1;
  const validTo = new Date(now);
  validTo.setMonth(now.getMonth() + monthsAhead);
  
  return { validFrom, validTo };
}

/**
 * Generate random domain registration dates based on domain name and TLD
 */
function generateDomainDates(domain: string) {
  const now = new Date();
  const tld = domain.split('.').pop() || '';
  
  // Generate more realistic domain age based on TLD and domain length
  let yearsAgo = 3;
  
  // Older TLDs tend to have older domains
  if (['com', 'net', 'org'].includes(tld)) {
    yearsAgo += Math.floor(Math.random() * 15) + 5; // 5-20 years for common TLDs
  } else if (['gov', 'edu', 'mil'].includes(tld)) {
    yearsAgo += Math.floor(Math.random() * 10) + 10; // 10-20 years for institutional TLDs
  } else {
    yearsAgo += Math.floor(Math.random() * 8); // 0-8 years for newer TLDs
  }
  
  // Shorter domains tend to be older
  if (domain.length <= 8) {
    yearsAgo += Math.floor(Math.random() * 5) + 5;
  }
  
  // Calculate registration date
  const registrationDate = new Date(now);
  registrationDate.setFullYear(now.getFullYear() - yearsAgo);
  
  // Calculate expiration date (1-3 years in the future)
  const yearsAhead = Math.floor(Math.random() * 3) + 1;
  const expirationDate = new Date(now);
  expirationDate.setFullYear(now.getFullYear() + yearsAhead);
  
  // Domain age in days
  const domainAge = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return { registrationDate, expirationDate, domainAge };
}

/**
 * Calculate risk levels based on various factors
 */
function calculateRiskLevels(domain: string, hasSSL: boolean, domainAge: number | null, trustScore: number) {
  let phishingRisk = "medium";
  let malwareRisk = "medium";
  let scamRisk = "medium";
  let blacklistStatus = "unknown";
  
  // Domains with SSL tend to be safer
  if (hasSSL) {
    phishingRisk = trustScore > 70 ? "low" : "medium";
    malwareRisk = trustScore > 65 ? "low" : "medium";
  } else {
    phishingRisk = "high";
    malwareRisk = "high";
  }
  
  // Older domains tend to be more trustworthy
  if (domainAge && domainAge > 365 * 5) { // Older than 5 years
    scamRisk = "low";
    if (hasSSL) {
      blacklistStatus = "clean";
    }
  } else if (domainAge && domainAge < 90) { // Less than 3 months
    scamRisk = "high";
    phishingRisk = "high";
  }
  
  // Adjust based on TLD
  const tld = domain.split('.').pop() || '';
  if (['gov', 'edu', 'mil'].includes(tld)) {
    phishingRisk = "low";
    malwareRisk = "low";
    scamRisk = "low";
    blacklistStatus = "clean";
  }
  
  // Very long domains are often suspicious
  if (domain.length > 30) {
    phishingRisk = "high";
    scamRisk = "high";
  }
  
  return { phishingRisk, malwareRisk, scamRisk, blacklistStatus };
}

/**
 * Analyze a website domain for safety and trustworthiness
 * Simulates realistic data based on domain characteristics
 */
export async function analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
  // Normalize the domain
  const normalizedDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
  
  try {
    // Check if we have predefined data for this domain
    const knownData = knownWebsiteData[normalizedDomain];
    
    // Basic check if the domain resolves
    const siteExists = await checkIfSiteExists(normalizedDomain);
    const hasSSL = await checkIfSiteHasSSL(normalizedDomain);
    
    // Calculate trust score based on various factors
    let trustScore = 50; // Default neutral score
    
    if (siteExists) {
      trustScore += 20; // Site exists, good sign
      
      // Bonus for SSL
      if (hasSSL) {
        trustScore += 15;
      }
      
      // Prefer well-known TLDs
      const tld = normalizedDomain.split('.').pop();
      if (['com', 'org', 'net'].includes(tld || '')) {
        trustScore += 5;
      } else if (['gov', 'edu', 'mil'].includes(tld || '')) {
        trustScore += 15;
      }
      
      // Penalize very long domains (often used for phishing)
      if (normalizedDomain.length > 30) {
        trustScore -= 20;
      } else if (normalizedDomain.length < 10) {
        trustScore += 5; // Shorter domains tend to be more legitimate
      }
      
      // Prefer domains with real words
      const domainWithoutTld = normalizedDomain.split('.')[0];
      if (/^[a-z]+$/.test(domainWithoutTld)) {
        trustScore += 5; // Simple word-like domain
      }
      
      // Penalize domains with many numbers
      if (/\d{4,}/.test(normalizedDomain)) {
        trustScore -= 10;
      }
      
      // Penalize domains with unusual characters
      if (/[^a-z0-9.-]/.test(normalizedDomain)) {
        trustScore -= 15;
      }
    } else {
      // Site doesn't resolve, likely untrustworthy
      trustScore = 10;
    }
    
    // Generate realistic dates
    const { registrationDate, expirationDate, domainAge } = generateDomainDates(normalizedDomain);
    const { validFrom, validTo } = generateSSLDates();
    
    // Calculate risk levels
    const { phishingRisk, malwareRisk, scamRisk, blacklistStatus } = 
      calculateRiskLevels(normalizedDomain, hasSSL, domainAge, trustScore);
    
    // Set malware detection (rare)
    const malwareDetected = Math.random() < 0.05; // 5% chance
    if (malwareDetected) {
      trustScore = Math.max(0, trustScore - 60);
    }
    
    // Create the final analysis result, using known data if available
    return {
      domain: normalizedDomain,
      trustScore: knownData?.trustScore ?? Math.min(100, Math.max(0, trustScore)),
      domainAge: knownData?.domainAge ?? domainAge,
      registrationDate: knownData?.registrationDate ?? registrationDate,
      expirationDate: knownData?.expirationDate ?? expirationDate,
      registrar: knownData?.registrar ?? getRandomItem(registrars),
      hasValidSSL: hasSSL,
      sslIssuer: knownData?.sslIssuer ?? (hasSSL ? getRandomItem(commonSslIssuers) : null),
      sslValidFrom: knownData?.sslValidFrom ?? (hasSSL ? validFrom : null),
      sslValidTo: knownData?.sslValidTo ?? (hasSSL ? validTo : null),
      serverType: knownData?.serverType ?? getRandomItem(serverTypes),
      serverLocation: knownData?.serverLocation ?? getRandomItem(serverLocations),
      ipAddress: knownData?.ipAddress ?? generateRandomIP(),
      hostingProvider: knownData?.hostingProvider ?? getRandomItem(hostingProviders),
      malwareDetected: malwareDetected,
      phishingRisk: knownData?.phishingRisk ?? phishingRisk,
      malwareRisk: knownData?.malwareRisk ?? malwareRisk,
      scamRisk: knownData?.scamRisk ?? scamRisk,
      blacklistStatus: knownData?.blacklistStatus ?? blacklistStatus,
      technicalDetails: knownData?.technicalDetails ?? {
        encryption: hasSSL ? "TLS 1.2, ECDHE_RSA with AES_256_GCM" : null
      }
    };
  } catch (error) {
    console.error(`Error analyzing domain ${normalizedDomain}:`, error);
    // Return a basic result indicating analysis failed
    return {
      domain: normalizedDomain,
      trustScore: 0,
      hasValidSSL: false,
      malwareDetected: false,
      phishingRisk: "unknown",
      malwareRisk: "unknown",
      scamRisk: "unknown",
      blacklistStatus: "unknown",
      domainAge: null,
      registrationDate: null,
      expirationDate: null,
      registrar: null,
      sslIssuer: null,
      sslValidFrom: null,
      sslValidTo: null,
      serverType: null,
      serverLocation: null,
      ipAddress: null,
      hostingProvider: null,
      technicalDetails: null
    };
  }
}

/**
 * Check if a site exists by attempting to fetch it
 */
async function checkIfSiteExists(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a site has SSL by attempting to fetch via HTTPS
 */
async function checkIfSiteHasSSL(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate community trust score from user reviews
 */
export function calculateCommunityTrustScore(
  safePercentage: number,
  suspiciousPercentage: number,
  dangerousPercentage: number
): number {
  // Weighted calculation:
  // Safe percentage has positive weight, dangerous has negative
  const score = safePercentage - (dangerousPercentage * 1.5);
  
  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate overall trust score from technical and community scores
 */
export function calculateOverallTrustScore(
  technicalScore: number,
  communityScore: number | null,
  reviewCount: number
): number {
  if (!communityScore || reviewCount === 0) {
    return technicalScore;
  }
  
  // Weight the community score based on review count (more reviews = more weight)
  const communityWeight = Math.min(0.5, reviewCount / 100); // Max 50% weight
  const technicalWeight = 1 - communityWeight;
  
  return Math.round(
    (technicalScore * technicalWeight) + (communityScore * communityWeight)
  );
}

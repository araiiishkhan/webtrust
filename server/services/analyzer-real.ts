import fetch from "node-fetch";
import { type Website } from "@shared/schema";
import whois from "whois-json";
import * as dns from "dns";
import * as psl from "psl";
import * as http from 'http';
import * as https from 'https';

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

/**
 * Analyze a website domain for safety and trustworthiness
 * Uses real WHOIS data and DNS lookups
 */
export async function analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
  // Normalize the domain
  const normalizedDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
  // Initialize trust score
  let trustScore = 50; // Default neutral score
  
  try {
    // Handle domains with paths by removing paths
    const domainWithoutPath = normalizedDomain.split('/')[0];

    // Ensure we have a valid domain
    const parsedDomain = psl.parse(domainWithoutPath);
    if (!parsedDomain.domain) {
      throw new Error("Invalid domain");
    }
    
    // Basic checks
    const hasSSL = await checkIfSiteHasSSL(normalizedDomain);
    const ipAddress = await getDomainIP(normalizedDomain);
    const serverInfo = await getServerInfo(normalizedDomain, hasSSL);
    
    // Get WHOIS data - handle special cases
    // For Netlify and similar hosting platforms, get WHOIS for the root domain
    let whoisDomain = normalizedDomain;
    
    // Special case for Netlify, Vercel, GitHub Pages, etc.
    // We'll identify them but still run the full analysis
    const isHostedAppPlatform = normalizedDomain.includes('netlify.app') || 
                               normalizedDomain.includes('vercel.app') || 
                               normalizedDomain.includes('github.io') ||
                               normalizedDomain.includes('herokuapp.com');
    
    if (isHostedAppPlatform) {
      // Adjust trust score for hosted app platforms - they are generally safe platforms
      trustScore += 10;
      console.log(`Identified hosted app platform: ${normalizedDomain} - continuing with regular analysis`);
    }
    
    const whoisData = await getWhoisData(whoisDomain);
    
    // Calculate domain age
    const domainAge = whoisData.creationDate ? 
      Math.floor((Date.now() - new Date(whoisData.creationDate).getTime()) / (1000 * 60 * 60 * 24)) : null;
    
    // Calculate trust score based on various factors
    // Note: we're reinitializing trustScore here because it was modified earlier for hosted apps
    trustScore = 50; // Default neutral score
    
    if (ipAddress) {
      trustScore += 20; // Site resolves, good sign
      
      // Bonus for SSL
      if (hasSSL) {
        trustScore += 15;
      }
      
      // Higher score for older domains
      if (domainAge) {
        if (domainAge > 365 * 10) { // > 10 years
          trustScore += 15;
        } else if (domainAge > 365 * 5) { // > 5 years
          trustScore += 10;
        } else if (domainAge > 365) { // > 1 year
          trustScore += 5;
        } else if (domainAge < 30) { // < 30 days
          trustScore -= 10; // New domains are more suspicious
        }
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
    
    // Calculate risk levels
    const {
      phishingRisk,
      malwareRisk,
      scamRisk,
      blacklistStatus
    } = calculateRiskLevels(normalizedDomain, hasSSL, domainAge, trustScore);
    
    // Set malware detection (simplified check)
    const malwareDetected = false; // We'd need an actual malware database API for this
    
    // Create the final analysis result
    return {
      domain: normalizedDomain,
      trustScore: Math.min(100, Math.max(0, trustScore)),
      domainAge,
      registrationDate: whoisData.creationDate ? new Date(whoisData.creationDate) : null,
      expirationDate: whoisData.expiryDate ? new Date(whoisData.expiryDate) : null,
      registrar: whoisData.registrar || null,
      hasValidSSL: hasSSL,
      sslIssuer: serverInfo.sslIssuer,
      sslValidFrom: serverInfo.sslValidFrom,
      sslValidTo: serverInfo.sslValidTo,
      serverType: serverInfo.serverType,
      serverLocation: null, // Would need a GeoIP database for this
      ipAddress,
      hostingProvider: isHostedAppPlatform ? 
                      (normalizedDomain.includes('netlify.app') ? 'Netlify' :
                       normalizedDomain.includes('vercel.app') ? 'Vercel' :
                       normalizedDomain.includes('github.io') ? 'GitHub Pages' :
                       normalizedDomain.includes('herokuapp.com') ? 'Heroku' : 'Cloud Platform') : 
                      null,
      malwareDetected,
      phishingRisk,
      malwareRisk,
      scamRisk,
      blacklistStatus,
      technicalDetails: {
        encryption: hasSSL ? (serverInfo.encryption || null) : null,
        creationDate: whoisData.creationDate,
        expiryDate: whoisData.expiryDate,
        nameServers: whoisData.nameServers
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
 * Get WHOIS data for a domain
 */
async function getWhoisData(domain: string): Promise<any> {
  try {
    console.log(`Fetching WHOIS data for domain: ${domain}`);
    const data = await whois(domain);
    console.log(`Raw WHOIS data received:`, JSON.stringify(data, null, 2));
    
    // Handle various WHOIS data formats
    const result = {
      creationDate: data.creationDate || data.created || data.registrationDate || data.domainRegistrationDate,
      expiryDate: data.expiryDate || data.expires || data.registrarRegistrationExpirationDate || data.registryExpiryDate,
      registrar: data.registrar,
      nameServers: []
    };
    
    // Parse name servers from different possible formats
    if (data.nameServer) {
      // Handle space-separated list in a single string
      if (typeof data.nameServer === 'string') {
        result.nameServers = data.nameServer.split(/\s+/).filter(Boolean);
      } else if (Array.isArray(data.nameServer)) {
        result.nameServers = data.nameServer;
      }
    } else if (data.nameServers) {
      if (typeof data.nameServers === 'string') {
        result.nameServers = data.nameServers.split(/\s+/).filter(Boolean);
      } else if (Array.isArray(data.nameServers)) {
        result.nameServers = data.nameServers;
      }
    } else if (data.nserver) {
      // Some WHOIS services use nserver
      if (typeof data.nserver === 'string') {
        result.nameServers = data.nserver.split(/\s+/).filter(Boolean);
      } else if (Array.isArray(data.nserver)) {
        result.nameServers = data.nserver;
      }
    }
    
    console.log(`Processed WHOIS data:`, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error(`Error getting WHOIS data for ${domain}:`, error);
    return {};
  }
}

/**
 * Get the IP address for a domain
 */
async function getDomainIP(domain: string): Promise<string | null> {
  try {
    console.log(`Looking up IP address for domain: ${domain}`);
    const result = await new Promise<string | null>((resolve, reject) => {
      dns.lookup(domain, (err, address) => {
        if (err) {
          console.log(`DNS lookup error for ${domain}:`, err.message);
          resolve(null);
        } else {
          console.log(`DNS lookup successful for ${domain}: ${address}`);
          resolve(address);
        }
      });
    });
    return result;
  } catch (error) {
    console.error(`Unexpected error in getDomainIP for ${domain}:`, error);
    return null;
  }
}

/**
 * Get server info for a domain
 */
async function getServerInfo(domain: string, useHttps: boolean): Promise<{
  serverType: string | null;
  sslIssuer: string | null;
  sslValidFrom: Date | null;
  sslValidTo: Date | null;
  encryption: string | null;
}> {
  const defaultResult = {
    serverType: null,
    sslIssuer: null,
    sslValidFrom: null,
    sslValidTo: null,
    encryption: null
  };
  
  try {
    console.log(`Getting server info for ${domain} (HTTPS: ${useHttps})`);
    return await new Promise((resolve) => {
      const req = (useHttps ? https : http).request(
        {
          hostname: domain,
          port: useHttps ? 443 : 80,
          path: '/',
          method: 'HEAD',
          timeout: 5000,
          rejectUnauthorized: false // Accept self-signed certs for analysis
        },
        (res) => {
          const serverHeader = res.headers['server'];
          const serverType = typeof serverHeader === 'string' ? serverHeader : null;
          console.log(`Server header for ${domain}: ${serverHeader || 'none'}`);
          
          // For HTTPS, get certificate info
          if (useHttps && res.socket && 'getPeerCertificate' in res.socket) {
            const socket = res.socket as any;
            const cert = socket.getPeerCertificate();
            
            if (cert && Object.keys(cert).length > 0) {
              console.log(`Certificate info for ${domain}:`, JSON.stringify({
                issuer: cert.issuer,
                valid_from: cert.valid_from,
                valid_to: cert.valid_to,
                cipher: socket.getCipher ? socket.getCipher().name : null
              }, null, 2));
              
              resolve({
                serverType,
                sslIssuer: typeof cert.issuer?.O === 'string' ? cert.issuer.O : null,
                sslValidFrom: cert.valid_from ? new Date(cert.valid_from) : null,
                sslValidTo: cert.valid_to ? new Date(cert.valid_to) : null,
                encryption: socket.getCipher ? `${socket.getCipher().name}` : null
              });
            } else {
              console.log(`No certificate info available for ${domain}`);
              resolve({ ...defaultResult, serverType });
            }
          } else {
            console.log(`Not HTTPS or no socket for ${domain}`);
            resolve({ ...defaultResult, serverType });
          }
          
          res.resume(); // Consume response data to free up memory
        }
      );
      
      req.on('error', (err) => {
        console.log(`Server info error for ${domain}:`, err.message);
        resolve(defaultResult);
      });
      
      req.on('timeout', () => {
        console.log(`Server info timeout for ${domain}`);
        req.destroy();
        resolve(defaultResult);
      });
      
      req.end();
    });
  } catch (error) {
    console.error(`Unexpected error in getServerInfo for ${domain}:`, error);
    return defaultResult;
  }
}

/**
 * Check if a site has SSL by attempting to fetch via HTTPS
 */
async function checkIfSiteHasSSL(domain: string): Promise<boolean> {
  try {
    console.log(`Checking SSL for domain: ${domain}`);
    return new Promise((resolve) => {
      const req = https.request(
        {
          hostname: domain,
          port: 443,
          path: '/',
          method: 'HEAD',
          timeout: 5000,
          rejectUnauthorized: false // Accept self-signed certs for analysis
        },
        (res) => {
          const hasSSL = res.statusCode !== undefined && res.statusCode < 400;
          console.log(`SSL check result for ${domain}: ${hasSSL} (status: ${res.statusCode})`);
          resolve(hasSSL);
          res.resume(); // Consume response data to free up memory
        }
      );
      
      req.on('error', (err) => {
        console.log(`SSL check error for ${domain}:`, err.message);
        resolve(false);
      });
      
      req.on('timeout', () => {
        console.log(`SSL check timeout for ${domain}`);
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    console.error(`Unexpected error in checkIfSiteHasSSL for ${domain}:`, error);
    return false;
  }
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

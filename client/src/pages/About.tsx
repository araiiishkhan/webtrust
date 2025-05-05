import { Link } from "wouter";
import { Shield, Lock, Users, Eye, FileCheck, AlertTriangle } from "lucide-react";
import SimpleAdBanner from "@/components/SimpleAdBanner";

const About = () => {
  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ad Banner */}
        <div className="mb-8">
          <SimpleAdBanner />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-roboto mb-4">
            About WebTrust
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to make the internet safer by providing transparent website analysis and community-driven safety information.
          </p>
        </div>
        
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-trust-green mr-3" />
            <h2 className="text-2xl font-bold font-roboto">Our Mission</h2>
          </div>
          
          <p className="text-gray-700 mb-6">
            At WebTrust, we believe everyone deserves to browse the internet safely. Our platform provides comprehensive website analysis that helps users make informed decisions about the sites they visit, protecting them from scams, phishing attempts, and malware.
          </p>
          
          <p className="text-gray-700">
            By combining technical analysis with community feedback, we create a more complete picture of a website's trustworthiness than traditional security tools alone can provide. Our goal is to create a safer online ecosystem through education, transparency, and community engagement.
          </p>
        </div>
        
        {/* How It Works Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-roboto text-center mb-8">
            How WebTrust Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-info-blue mb-4">
                <Eye className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold font-roboto mb-2">Analysis</h3>
              <p className="text-gray-600">
                We analyze domains using multiple technical signals including domain age, SSL certificates, hosting information, and security database checks.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-trust-green mb-4">
                <FileCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold font-roboto mb-2">Reporting</h3>
              <p className="text-gray-600">
                Our platform generates detailed reports with trust scores, safety indicators, and potential red flags that help you assess website credibility.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-medium-risk mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold font-roboto mb-2">Community</h3>
              <p className="text-gray-600">
                We incorporate user reviews and feedback to provide real-world experiences with websites, enhancing the technical analysis with human insights.
              </p>
            </div>
          </div>
        </div>
        
        {/* Why Trust Us Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center mb-6">
            <Lock className="h-8 w-8 text-trust-green mr-3" />
            <h2 className="text-2xl font-bold font-roboto">Why Trust WebTrust?</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Transparency:</strong> We clearly explain all the factors that contribute to our trust scores, so you understand exactly why a website received its rating.
            </p>
            
            <p className="text-gray-700">
              <strong>Community-Driven:</strong> Our platform combines technical analysis with real user experiences, creating a more comprehensive view of website safety.
            </p>
            
            <p className="text-gray-700">
              <strong>Educational Focus:</strong> Beyond just providing ratings, we help users understand online risks and how to protect themselves through our blog and detailed reports.
            </p>
            
            <p className="text-gray-700">
              <strong>No Conflicts of Interest:</strong> We don't accept payment from websites to improve their ratings or remove negative reviews, ensuring our assessments remain unbiased.
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-trust-green text-white rounded-lg shadow-md p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-roboto mb-4">
            Stay Safe Online with WebTrust
          </h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Before you share personal information or make purchases online, take a moment to check the website's reputation.
          </p>
          <Link href="/">
            <a className="inline-block bg-white text-trust-green hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md">
              Analyze a Website Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

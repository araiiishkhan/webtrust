import { Link } from "wouter";
import { Shield, Facebook, Twitter, Linkedin } from "lucide-react";
import BottomAdBanner from "./BottomAdBanner";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      {/* Bottom Ad Banner */}
      <BottomAdBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-trust-green" />
              <h2 className="ml-2 text-xl font-bold font-roboto">WebTrust</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for website safety analysis and online security information.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-roboto mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Website Analysis</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Malware Scanning</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Phishing Detection</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">SSL Verification</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Domain Information</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-roboto mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Safety Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Scam Database</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Research Papers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-roboto mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WebTrust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

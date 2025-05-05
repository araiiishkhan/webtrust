import React, { useEffect } from 'react';

interface DirectAdBannerProps {
  className?: string;
}

const DirectAdBanner: React.FC<DirectAdBannerProps> = ({ className = '' }) => {
  useEffect(() => {
    try {
      // Define the ad options globally first
      // Using a properly typed approach to set a global variable
      (window as any).atOptions = {
        'key': '576aaf68c7c89c402ccfe94774df25ce',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
      
      console.log('Ad options set on window:', (window as any).atOptions);
      
      // Create the script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//www.highperformanceformat.com/576aaf68c7c89c402ccfe94774df25ce/invoke.js';
      
      // Add error and load handlers to debug
      script.onerror = (error) => {
        console.error('Ad script failed to load:', error);
      };
      
      script.onload = () => {
        console.log('Ad script loaded successfully');
      };
      
      // Add the script to the document
      document.body.appendChild(script);
      
      return () => {
        // Clean up on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        // Cleanup global variable
        delete (window as any).atOptions;
      };
    } catch (error) {
      console.error('Error setting up ad:', error);
      return undefined;
    }
  }, []);
  
  return (
    <div 
      className={`w-full max-w-[728px] h-[90px] mx-auto overflow-hidden ${className}`}
      id="ad-container-direct"
    >
      {/* This div will be populated by the ad script */}
    </div>
  );
};

export default DirectAdBanner;
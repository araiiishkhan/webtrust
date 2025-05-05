import React, { useEffect, useRef } from 'react';

const BottomAdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First, define atOptions on the window for this specific instance
    // We're creating a separate instance for the bottom ad
    const bottomAdOptions = {
      'key': '576aaf68c7c89c402ccfe94774df25ce',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };

    // Then create and append the invoke script
    if (adContainerRef.current) {
      // Set atOptions right before creating the script
      (window as any).atOptions = bottomAdOptions;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//www.highperformanceformat.com/576aaf68c7c89c402ccfe94774df25ce/invoke.js';
      
      // Add error and load handlers
      script.onerror = () => {
        console.error('Bottom ad script failed to load');
      };
      
      script.onload = () => {
        console.log('Bottom ad script loaded successfully');
      };
      
      adContainerRef.current.appendChild(script);
      
      return () => {
        // Clean up
        if (adContainerRef.current && adContainerRef.current.contains(script)) {
          adContainerRef.current.removeChild(script);
        }
        // We don't delete window.atOptions here as it might be used by other ad instances
      };
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-8 bg-white border-b border-gray-700">
      <div 
        ref={adContainerRef}
        className="ad-container-bottom w-[728px] h-[90px] overflow-hidden" 
      />
    </div>
  );
};

export default BottomAdBanner;
import React, { useEffect, useRef } from 'react';

const SimpleAdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First, define atOptions on the window
    (window as any).atOptions = {
      'key': '576aaf68c7c89c402ccfe94774df25ce',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };

    // Then create and append the invoke script
    if (adContainerRef.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//www.highperformanceformat.com/576aaf68c7c89c402ccfe94774df25ce/invoke.js';
      
      // Add error and load handlers
      script.onerror = () => {
        console.error('Ad script failed to load');
      };
      
      script.onload = () => {
        console.log('Ad script loaded successfully');
      };
      
      adContainerRef.current.appendChild(script);
      
      return () => {
        // Clean up
        if (adContainerRef.current && adContainerRef.current.contains(script)) {
          adContainerRef.current.removeChild(script);
        }
        delete (window as any).atOptions;
      };
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-white">
      <div 
        ref={adContainerRef}
        className="ad-container w-[728px] h-[90px] overflow-hidden" 
      />
    </div>
  );
};

export default SimpleAdBanner;
import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner = ({ className = '' }: AdBannerProps) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and inject the ad scripts when the component mounts
    const injectAdScript = () => {
      try {
        // Create options script
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.text = `
          atOptions = {
            'key' : '576aaf68c7c89c402ccfe94774df25ce',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        
        // Create invoke script
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = '//www.highperformanceformat.com/576aaf68c7c89c402ccfe94774df25ce/invoke.js';
        
        // Append scripts directly to the ad container
        if (adContainerRef.current) {
          adContainerRef.current.appendChild(optionsScript);
          adContainerRef.current.appendChild(invokeScript);
        }
      } catch (error) {
        console.error('Error injecting ad script:', error);
      }
    };

    injectAdScript();
    
    return () => {
      // Clean up happens automatically when the component unmounts
    };
  }, []);

  return (
    <div 
      ref={adContainerRef} 
      className={`w-full max-w-[728px] h-[90px] mx-auto ${className}`}
      id="ad-container"
    >
      {/* Ad content will be injected here by the script */}
    </div>
  );
};

export default AdBanner;
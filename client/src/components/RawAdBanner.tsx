import React from 'react';

interface RawAdBannerProps {
  className?: string;
}

const RawAdBanner: React.FC<RawAdBannerProps> = ({ className = '' }) => {
  return (
    <div className={`mx-auto ${className}`}>
      {/* Using dangerouslySetInnerHTML to add the exact ad code format */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <div style="width:100%;max-width:728px;height:90px;margin:0 auto;overflow:hidden;background:#f1f1f1;">
              <script type="text/javascript">
                atOptions = {
                  'key' : '576aaf68c7c89c402ccfe94774df25ce',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
                document.write('<scr' + 'ipt type="text/javascript" src="//www.highperformanceformat.com/576aaf68c7c89c402ccfe94774df25ce/invoke.js"></scr' + 'ipt>');
              </script>
            </div>
          `
        }}
      />
    </div>
  );
};

export default RawAdBanner;
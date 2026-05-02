import React from 'react';

interface CustomerScriptProps {
  script: string;
}

export const CustomerScript: React.FC<CustomerScriptProps> = ({ script }) => {
  return (
    <div className="relative bg-white p-8 rounded-[2.5rem] shadow-md border border-gray-50 overflow-hidden group">
      {/* Decorative left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-kb-gold)] to-[var(--color-kb-gold-dark)]"></div>
      
      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Chat Bubble Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-[#FFFDE7] rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
          💬
        </div>
        
        <div className="flex-1 space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <span>고객님을 위한 가이드</span>
          </h3>
          
          <div className="relative">
            {/* Big Quote marks */}
            <span className="absolute -top-4 -left-2 text-4xl text-[var(--color-kb-gold)] opacity-20 font-serif">"</span>
            
            <p className="text-lg md:text-xl text-gray-800 font-bold leading-relaxed italic font-serif px-4">
              {script}
            </p>
            
            <span className="absolute -bottom-6 -right-2 text-4xl text-[var(--color-kb-gold)] opacity-20 font-serif">"</span>
          </div>
        </div>
      </div>

      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-kb-gold)] opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125"></div>
    </div>
  );
};

import React from 'react';

interface RebalancingStepsProps {
  steps: string[];
}

export const RebalancingSteps: React.FC<RebalancingStepsProps> = ({ steps }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="group relative bg-[#FDFCF9] p-5 rounded-2xl border border-gray-100 hover:border-[var(--color-kb-gold)] transition-all flex items-start space-x-4 shadow-sm hover:shadow-md"
          >
            {/* Step Number Badge */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--color-kb-gold)] to-[var(--color-kb-gold-dark)] rounded-full flex items-center justify-center text-white text-sm font-black shadow-sm group-hover:scale-110 transition-transform">
              {index + 1}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-700 leading-relaxed pr-6">
                {step}
              </p>
            </div>

            {/* Check Icon (Visual indicator) */}
            <div className="absolute top-5 right-5 text-[var(--color-kb-gold)] opacity-20 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

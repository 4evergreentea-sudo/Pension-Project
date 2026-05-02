import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 font-bold mb-1">문제가 발생했습니다</h3>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>다시 시도하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

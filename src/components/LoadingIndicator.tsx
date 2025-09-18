import React from 'react';
import { BotIcon } from './IconComponents';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <BotIcon />
        </div>
        <div className="bg-gray-700/80 rounded-xl rounded-bl-none p-3 flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
  );
};

export default LoadingIndicator;

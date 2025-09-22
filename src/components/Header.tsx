import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-gray-700 bg-gray-800/50 rounded-t-2xl flex items-center justify-center shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse"></div>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Hallyu AI Chatbot
        </h1>
      </div>
    </header>
  );
};

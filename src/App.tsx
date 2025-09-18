import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[90vh] bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col border border-gray-700">
        <Header />
        <ChatInterface />
      </div>
       <footer className="text-center text-xs text-gray-400 mt-4">
          <p>Powered by Google Gemini. UI designed for an immersive Hallyu experience.</p>
        </footer>
    </div>
  );
};

export default App;

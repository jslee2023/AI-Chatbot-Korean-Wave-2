import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
}

// A simple markdown to HTML converter
const formatText = (text: string) => {
    const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const newlined = bolded.replace(/\n/g, '<br />');
    return { __html: newlined };
};


const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const messageClasses = isUser
    ? 'bg-blue-600/80 self-end rounded-br-none'
    : 'bg-gray-700/80 self-start rounded-bl-none';

  const containerClasses = isUser
    ? 'flex items-end justify-end gap-2'
    : 'flex items-end gap-2';
    
  const textContent = <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={formatText(message.text)} />;


  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
          <BotIcon />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg p-3 rounded-xl shadow-md ${messageClasses}`}
      >
        {textContent}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shadow-md">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;

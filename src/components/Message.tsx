// src/components/Message.tsx
import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && ( // 봇 메시지일 때만 아바타 표시
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2 shadow-md"
          aria-hidden="true"
        >
          <BotIcon size={18} ariaHidden />
        </div>
      )}
      <div
        className={`flex flex-col max-w-[80%] px-4 py-2 rounded-xl shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none' // 사용자 메시지 스타일
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none' // 봇 메시지 스타일
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p> {/* 텍스트 줄바꿈 유지 */}
      </div>
      {isUser && ( // 사용자 메시지일 때만 아바타 표시
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center ml-2 shadow-md"
          aria-hidden="true"
        >
          <UserIcon size={18} ariaHidden />
        </div>
      )}
    </div>
  );
});

Message.displayName = 'Message';

export default Message;

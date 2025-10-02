// src/components/Message.tsx
import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
}

// 간단한 Markdown-like 텍스트 포맷터 (볼드와 줄바꿈 지원)
const formatText = (text: string) => {
  const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const newlined = bolded.replace(/\n/g, '<br />');
  return { __html: newlined };
};

const Message: React.FC<MessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === Sender.User;

  const messageClasses = isUser
    ? 'bg-blue-600/80 self-end rounded-br-none' // 반투명 + 사용자 스타일
    : 'bg-gray-700/80 dark:bg-gray-700/80 self-start rounded-tl-none'; // 다크 모드 + 봇 스타일

  const containerClasses = `flex items-end ${isUser ? 'justify-end' : 'justify-start'} gap-2 mb-3`;

  const textContent = (
    <div
      className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap" // prose 가독성 + 줄바꿈 보존
      dangerouslySetInnerHTML={formatText(message.text)}
    />
  );

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md mr-2"
          aria-hidden="true"
        >
          <BotIcon size={18} ariaHidden />
        </div>
      )}
      <div className={`max-w-[80%] md:max-w-lg p-3 rounded-xl shadow-md ${messageClasses}`}>
        {textContent}
      </div>
      {isUser && (
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

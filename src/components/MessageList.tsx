// src/components/MessageList.tsx
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator'; // LoadingIndicator를 가져옵니다.

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean; // 챗봇이 로딩 중인지 알려주는 prop
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]); // 메시지나 로딩 상태 변경 시 스크롤

  return (
    // 💡 배경색이 isLoading에 따라 변경되지 않도록 고정합니다. (원하는 평상시 배경색으로 지정)
    <div
      role="log"
      aria-live="polite"
      className="
        flex-1 overflow-y-auto max-h-[70vh] p-4 space-y-3
        bg-white dark:bg-gray-900 // 👈 평상시 배경색을 그대로 유지합니다. 로딩 중에도 이 색이 유지됩니다.
        shadow-inner
      "
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {/* isLoading이 true일 때만 LoadingIndicator를 렌더링합니다. */}
      {isLoading && (
        <div className="flex justify-center py-2"> {/* LoadingIndicator를 중앙 정렬하기 위한 div */}
          <LoadingIndicator />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default MessageList;

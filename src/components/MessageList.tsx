// src/components/MessageList.tsx (변화 없음 - 이전 단계에서 수정 완료)
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      role="log"
      aria-live="polite"
      className="
        flex-1 overflow-y-auto max-h-[70vh] p-4 space-y-3
        bg-white dark:bg-gray-900 // 👈 이 배경색이 로딩 중에도 그대로 유지됩니다.
        shadow-inner
      "
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {isLoading && (
        <div className="flex justify-center py-2">
          <LoadingIndicator />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default MessageList;

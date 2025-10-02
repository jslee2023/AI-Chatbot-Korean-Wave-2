// src/components/MessageList.tsx
import React, { useRef, useEffect, useCallback } from 'react'; // useCallback 추가
import type { ChatMessage } from '../types';
import Message from './Message';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean; // 로딩 상태를 prop으로 받아 스크롤 로직에 활용
}

const MessageList: React.FC<MessageListProps> = React.memo(({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 메시지나 로딩 상태 변경 시 가장 아래로 자동 스크롤
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 50); // 지연으로 렌더링 후 스크롤 (튀는 현상 완화)
    return () => clearTimeout(timer);
  }, [messages, isLoading, scrollToBottom]);

  return (
    <div
      role="log"
      aria-live="polite"
      className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4 bg-blue-500 dark:bg-gray-900 shadow-inner max-h-[70vh] min-h-0"
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} /> {/* 스크롤 위치를 잡아줄 빈 div */}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;

// src/components/MessageList.tsx
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';
// 💡 LoadingIndicator는 ChatInterface에서 단일하게 관리하기 위해 MessageList에서는 직접 렌더링하지 않습니다.
// import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  // 💡 로딩 상태를 prop으로 받아 스크롤 로직에 활용할 수 있도록 남겨둡니다.
  // 이 prop이 LoadingIndicator를 직접 렌더링하는 데 사용되지 않도록 합니다.
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = React.memo(({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지나 로딩 상태 변경 시 가장 아래로 자동 스크롤
  useEffect(() => {
    // 💡 화면 튀는 현상 완화를 위해 setTimeout을 사용하거나, 로딩 완료 시점에만 스크롤하도록 조건 추가 가능
    const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50); // 약간의 지연으로 렌더링 후 스크롤
    return () => clearTimeout(timer);
  }, [messages, isLoading]); // 메시지 목록 또는 로딩 상태가 변경될 때마다 스크롤

  return (
    <div
      role="log"
      aria-live="polite"
      className="flex flex-col flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-gray-900 shadow-inner max-h-[70vh] min-h-0"
      // 💡 className 내부의 불필요한 주석을 모두 제거하여 TS 에러 방지
      // 💡 max-h-[70vh]와 min-h-0를 명확히 지정하여 높이 변화로 인한 화면 흔들림(점프) 방지 및 유연한 높이 관리
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {/* 💡 LoadingIndicator는 ChatInterface에서만 렌더링하도록 이 부분은 제거합니다. */}
      {/* {isLoading && (
        <div className="flex justify-center py-2">
          <LoadingIndicator />
        </div>
      )} */}
      <div ref={messagesEndRef} /> {/* 스크롤 위치를 잡아줄 빈 div */}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;

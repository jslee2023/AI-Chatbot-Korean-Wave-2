// src/components/MessageList.tsx
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
      className="flex flex-col
        flex-1 overflow-y-auto p-4 space-y-3
        bg-white dark:bg-gray-900
        shadow-inner
        // 💡 중요! 이 div의 높이를 flex-1만으로는 불안정할 수 있으니 min-h-0을 추가해 flex 아이템의 최소 크기를 0으로 만듭니다.
        // 그리고 flex-grow가 자랄 수 있도록 합니다.
        // max-h-[70vh]는 이미 높이를 제한하지만, 내부 content가 없거나 적을 때 flex-grow와 충돌할 수 있습니다.
        min-h-0 flex-grow // 👈 추가
      "
      // Note: 'max-h-[70vh]'는 ChatInterface.tsx에서 H-full을 부여하므로 MessageList에서는 제거하는 것을 고려해볼 수 있습니다.
      // ChatInterface 내에서 ChatInterface가 flex-grow로 남은 공간을 차지하고, MessageList가 flex-grow를 가지면
      // ChatInterface가 채운 공간 내에서 MessageList가 최대한 커집니다.
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
       {isLoading && (
         <div className="flex justify-center"> {/* py-2는 그대로 둡시다, LoadingIndicator 주위에 약간의 패딩이 있으면 더 자연스러울 수 있습니다. */}
           <LoadingIndicator />
         </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default MessageList;

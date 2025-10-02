// src/components/Message.tsx
import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message?: ChatMessage; // 기존 메시지 (옵셔널로 로딩 시 생략)
  loading?: boolean;    // 로딩 상태 (true 시 점 애니메이션 표시)
}

// 간단한 Markdown-like 텍스트 포맷터 (볼드와 줄바꿈 지원)
const formatText = (text: string) => {
  const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const newlined = bolded.replace(/\n/g, '<br />');
  return { __html: newlined };
};

// DancingDots 컴포넌트 (LoadingIndicator에서 이동)
const DancingDots: React.FC<{ count?: number; dotClassName?: string; gapClassName?: string }> = React.memo(({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse',
  gapClassName = 'space-x-1.5',
}) => {
  const reducedMotion = 'motion-reduce:animate-none';

  return (
    <div className={`flex items-center ${gapClassName}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`${dotClassName} ${reducedMotion}`}
          style={{ animationDelay: `${i * 0.2}s` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

const Message: React.FC<MessageProps> = React.memo(({ message, loading = false }) => {
  const isUser = message?.sender === Sender.User;
  const isBotLoading = loading && !isUser; // 로딩은 봇 메시지에만 적용

  if (isBotLoading) {
    // 로딩 시: 빈 봇 메시지 + DancingDots
    return (
      <div className="flex justify-start gap-2 mb-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md mr-2"
          aria-hidden="true"
        >
          <BotIcon size={18} ariaHidden />
        </div>
        <div className="max-w-[80%] md:max-w-lg p-3 rounded-xl shadow-md bg-gray-300/90 dark:bg-gray-700/90 self-start rounded-tl-none">
          <DancingDots />
        </div>
      </div>
    );
  }

  if (!message) return null; // 로딩 아닌데 메시지 없으면 아무것도 안 보임

  const messageClasses = isUser
    ? 'bg-blue-500/80 self-end rounded-br-none' // 반투명 + 사용자 스타일
    : 'bg-gray-300/90 dark:bg-gray-700/90 self-start rounded-tl-none'; // 더 진한 배경

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

// src/components/Message.tsx
import React from 'react'; // React import 추가
import type { ChatMessage } from '../types';
import { Sender } from '../types'; // type 제거: value로 사용
import { BotIcon, UserIcon } from './IconComponents'; // icons import 추가

interface MessageProps { // interface 정의
  message: ChatMessage;
}

// 로딩용 더미 메시지 생성 헬퍼 (export)
export const createLoadingMessage = (): ChatMessage => ({
  id: `loading-${Date.now()}`,
  sender: Sender.Bot,
  text: '', // 빈 텍스트 = 로딩
});

// 간단한 Markdown-like 텍스트 포맷터
const formatText = (text: string) => {
  const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const newlined = bolded.replace(/\n/g, '<br />');
  return { __html: newlined };
};

// DancingDots 컴포넌트 (내부)
const DancingDots: React.FC<{ count?: number; dotClassName?: string; gapClassName?: string }> = React.memo(({
  count = 3,
  dotClassName = 'w-2 h-2 bg-white-900 dark:bg-white-100 rounded-full animate-pulse',
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

const MessageComponent: React.FC<MessageProps> = React.memo(({ message }) => { // 이름 변경: Message conflict 피함
  if (!message) return null;

  const isUser = message.sender === Sender.User;
  const isBotLoading = message.sender === Sender.Bot && message.text === ''; // 빈 봇 = 로딩

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

  const messageClasses = isUser
    ? 'bg-blue-200/80 self-end rounded-br-none'
    : 'bg-yellow-200/100 dark:bg-yellow-200/100 self-start rounded-tl-none';

  const containerClasses = `flex items-end ${isUser ? 'justify-end' : 'justify-start'} gap-2 mb-3`;

  const textContent = (
    <div
      className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-blue-600 dark:text-blue-300"
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

MessageComponent.displayName = 'Message';

export default MessageComponent; // default export

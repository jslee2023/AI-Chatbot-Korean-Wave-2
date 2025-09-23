import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';
// DOMPurify 사용 권장: npm i dompurify
import DOMPurify from 'dompurify';

interface MessageProps {
  message: ChatMessage;
  maxWidthClass?: string;     // 말풍선 최대폭 커스터마이즈
  showAvatar?: boolean;       // 아바타 노출 여부
  enableMarkdown?: boolean;   // 마크다운 렌더 활성화
}

/**
 * 매우 단순한 마크다운 파서
 * - 굵게(**bold**), 줄바꿈, 인라인 코드(`code`), 링크[txt](url) 정도만 지원
 * - 반드시 sanitize와 함께 사용
 */
const toHtml = (raw: string) => {
  let text = raw;

  // 이스케이프(기본): angle brackets → 안전 문자. 코드블록 처리 전 최소화
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 인라인 코드 `code`
  text = text.replace(/`([^`]+?)`/g, '<code>$1</code>');

  // 링크 [text](url)
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline decoration-dotted">$1</a>'
  );

  // 굵게 **bold**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 줄바꿈 → <br />
  text = text.replace(/\n/g, '<br />');

  return text;
};

const sanitize = (html: string) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

const MessageBubble: React.FC<React.PropsWithChildren<{
  isUser: boolean;
  maxWidthClass?: string;
}>> = ({ isUser, maxWidthClass = 'max-w-md md:max-w-lg', children }) => {
  const bubbleBase =
    'p-3 rounded-xl shadow-md break-words [overflow-wrap:anywhere] prose prose-invert prose-sm max-w-none';
  const bg = isUser
    ? 'bg-blue-600/80 rounded-br-none'
    : 'bg-gray-700/80 rounded-bl-none';
  return <div className={`${bubbleBase} ${bg} ${maxWidthClass}`}>{children}</div>;
};

const Avatar: React.FC<{ isUser: boolean }> = ({ isUser }) => {
  const base = 'flex-shrink-0 w-8 h-8 flex items-center justify-center shadow-md rounded-full';
  if (isUser) {
    return (
      <div className={`${base} bg-gray-600`} aria-hidden="true">
        <UserIcon ariaHidden />
      </div>
    );
  }
  return (
    <div
      className={`${base} bg-gradient-to-br from-purple-500 to-pink-500`}
      aria-hidden="true"
    >
      <BotIcon ariaHidden />
    </div>
  );
};

const SafeContent: React.FC<{ text: string; enableMarkdown: boolean }> = ({
  text,
  enableMarkdown,
}) => {
  if (!enableMarkdown) {
    return <p className="m-0 whitespace-pre-wrap">{text}</p>;
  }
  const html = sanitize(toHtml(text));
  return (
    <div
      className="m-0"
      // Tailwind의 prose 스타일이 상위 Bubble에 이미 적용되어 있음
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const Message: React.FC<MessageProps> = React.memo(
  ({ message, maxWidthClass, showAvatar = true, enableMarkdown = true }) => {
    const isUser = message.sender === Sender.User;

    // 정렬 컨테이너
    const container = isUser
      ? 'flex items-end justify-end gap-2'
      : 'flex items-end gap-2';

    // 시맨틱/접근성: role="group"으로 묶고, 보조기술용 라벨 제공
    const ariaLabel = isUser ? '사용자 메시지' : '봇 메시지';

    return (
      <div className={container} role="group" aria-label={ariaLabel}>
        {!isUser && showAvatar && <Avatar isUser={false} />}

        <MessageBubble isUser={isUser} maxWidthClass={maxWidthClass}>
          <SafeContent text={message.text} enableMarkdown={enableMarkdown} />
        </MessageBubble>

        {isUser && showAvatar && <Avatar isUser />}
      </div>
    );
  }
);

Message.displayName = 'Message';

export default Message;

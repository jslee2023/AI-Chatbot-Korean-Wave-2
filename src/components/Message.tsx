import React, { useEffect, useMemo, useState } from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
  maxWidthClass?: string;   // 말풍선 최대폭 커스터마이즈
  showAvatar?: boolean;     // 아바타 노출 여부
  enableMarkdown?: boolean; // 마크다운 렌더 활성화
}

/* 1) 최소 XSS 방지: 기본 이스케이프 후 간단 마크다운 파싱 */
const toHtml = (raw: string) => {
  let text = raw;

  // 기본 이스케이프
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

  // 줄바꿈
  text = text.replace(/\n/g, '<br />');

  return text;
};

/* 2) dompurify 동적 로딩 + 폴백 sanitizer
   - dompurify 설치 전에도 빌드 실패가 없도록 구성
   - 설치 후에는 자동으로 dompurify를 사용 */
type SanitizeFn = (html: string) => string;

let cachedSanitize: SanitizeFn | null = null;

const basicFallbackSanitize: SanitizeFn = (html) => {
  // script/style 태그 제거
  html = html.replace(/<\s*(script|style)[^>]*>.*?<\s*\/\s*\1\s*>/gis, '');
  // on* 이벤트 속성 제거
  html = html.replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi, '');
  // javascript: 제거
  html = html.replace(/\s(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');
  return html;
};

async function ensureSanitizer(): Promise<SanitizeFn> {
  if (cachedSanitize) return cachedSanitize;

  if (typeof window !== 'undefined') {
    try {
      // dompurify가 설치되어 있으면 로드
      const mod = await import('dompurify');
      cachedSanitize = (html: string) =>
        mod.default.sanitize(html, {
          USE_PROFILES: { html: true },
          ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        });
      return cachedSanitize;
    } catch {
      // 설치 안 되어 있으면 폴백 사용
      cachedSanitize = basicFallbackSanitize;
      return cachedSanitize;
    }
  }

  // SSR 등 윈도우 없는 환경: 최소 폴백
  cachedSanitize = (html: string) => html;
  return cachedSanitize;
}

/* 3) 프레젠테이션 컴포넌트들 */
const MessageBubble: React.FC<
  React.PropsWithChildren<{ isUser: boolean; maxWidthClass?: string }>
> = ({ isUser, maxWidthClass = 'max-w-md md:max-w-lg', children }) => {
  const base =
    'p-3 rounded-xl shadow-md break-words [overflow-wrap:anywhere] prose prose-invert prose-sm max-w-none';
  const bg = isUser ? 'bg-blue-600/80 rounded-br-none' : 'bg-gray-700/80 rounded-bl-none';
  return <div className={`${base} ${bg} ${maxWidthClass}`}>{children}</div>;
};

const Avatar: React.FC<{ isUser: boolean }> = ({ isUser }) => {
  const base = 'flex-shrink-0 w-8 h-8 flex items-center justify-center shadow-md rounded-full';
  return isUser ? (
    <div className={`${base} bg-gray-600`} aria-hidden="true">
      <UserIcon ariaHidden />
    </div>
  ) : (
    <div className={`${base} bg-gradient-to-br from-purple-500 to-pink-500`} aria-hidden="true">
      <BotIcon ariaHidden />
    </div>
  );
};

/* 4) 안전 렌더러 */
const SafeContent: React.FC<{ text: string; enableMarkdown: boolean }> = ({
  text,
  enableMarkdown,
}) => {
  // enableMarkdown=false면 plain text로 렌더
  const [html, setHtml] = useState<string>('');
  const rawHtml = useMemo(() => (enableMarkdown ? toHtml(text) : ''), [text, enableMarkdown]);

  useEffect(() => {
    let mounted = true;
    if (!enableMarkdown) {
      setHtml('');
      return;
    }
    (async () => {
      const sanitize = await ensureSanitizer();
      const safe = sanitize(rawHtml);
      if (mounted) setHtml(safe);
    })();
    return () => {
      mounted = false;
    };
  }, [rawHtml, enableMarkdown]);

  if (!enableMarkdown) {
    return (
      <p className="m-0 whitespace-pre-wrap" dir="auto">
        {text}
      </p>
    );
  }

  return <div className="m-0" dir="auto" dangerouslySetInnerHTML={{ __html: html }} />;
};

/* 5) 메인 컴포넌트 */
const Message: React.FC<MessageProps> = React.memo(
  ({ message, maxWidthClass, showAvatar = true, enableMarkdown = true }) => {
    const isUser = message.sender === Sender.User;
    const container = isUser ? 'flex items-end justify-end gap-2' : 'flex items-end gap-2';
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

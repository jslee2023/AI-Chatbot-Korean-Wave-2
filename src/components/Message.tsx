import React from 'react';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import { BotIcon, UserIcon } from './IconComponents';

interface MessageProps {
  message: ChatMessage;
}

/**
 * 줄바꿈 처리: 문자열을 \n 기준으로 분할하여 <br />로 연결
 */
function splitByNewline(text: string): (string | JSX.Element)[] {
  const parts = text.split('\n');
  return parts.flatMap((part, idx) =>
    idx === 0 ? [part] : [<br key={`br-${idx}`} />, part]
  );
}

/**
 * 굵게 마크다운 처리: **bold** 구문만 지원
 * - 정규식으로 토큰화 후 React 요소로 안전하게 렌더링
 * - HTML을 삽입하지 않기 때문에 XSS 위험을 크게 줄임
 */
function inlineBold(nodes: (string | JSX.Element)[]): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  nodes.forEach((node, i) => {
    if (typeof node !== 'string') {
      result.push(node);
      return;
    }
    // **...** 패턴을 찾음
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(node)) !== null) {
      const [full, inside] = match;
      const start = match.index;

      if (start > lastIndex) {
        result.push(node.slice(lastIndex, start));
      }
      result.push(<strong key={`b-${i}-${start}`}>{inside}</strong>);
      lastIndex = start + full.length;
    }
    if (lastIndex < node.length) {
      result.push(node.slice(lastIndex));
    }
  });
  return result;
}

/**
 * 텍스트를 안전하게 React 노드로 변환
 * - 지원: 줄바꿈, 굵게
 * - 필요 시 인라인 코드, 링크 등 점진 확장 가능
 */
function renderSafeText(text: string): React.ReactNode {
  const withNewlines = splitByNewline(text);
  const withBold = inlineBold(withNewlines);
  return withBold;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const messageClasses = isUser
    ? 'bg-blue-600/80 self-end rounded-br-none'
    : 'bg-gray-700/80 self-start rounded-bl-none';

  const containerClasses = isUser
    ? 'flex items-end justify-end gap-2'
    : 'flex items-end gap-2';

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md" aria-hidden="true">
          <BotIcon ariaHidden />
        </div>
      )}

      <div className={`max-w-md md:max-w-lg p-3 rounded-xl shadow-md ${messageClasses}`}>
        {/* prose를 유지하되, dangerouslySetInnerHTML은 사용하지 않습니다 */}
        <div className="prose prose-invert prose-sm max-w-[80%]">
          {renderSafeText(message.text)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shadow-md" aria-hidden="true">
          <UserIcon ariaHidden />
        </div>
      )}
    </div>
  );
};

export default Message;

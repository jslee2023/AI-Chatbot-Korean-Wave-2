import React, { useRef, useEffect } from 'react'; // useRef, useEffect 훅을 import 합니다.
import type { ChatMessage } from '../types';
import Message from './Message';

type MessageListProps = { messages: ChatMessage[] };

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 목록의 끝을 참조할 Ref를 생성합니다.

  // 메시지 배열이 업데이트될 때마다(새 메시지가 도착할 때마다) 스크롤을 가장 아래로 내립니다.
  useEffect(() => {
    // current가 null이 아닌지 확인하고 scrollIntoView 메서드를 호출합니다.
    // { behavior: 'smooth' }를 사용하면 부드럽게 스크롤됩니다.
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // messages prop이 변경될 때마다 이 useEffect가 다시 실행됩니다.

  return (
    // 💡 아래 div에 Tailwind CSS 클래스를 추가하여 스크롤 기능을 활성화합니다.
    // flex-1: 부모 컨테이너(아마 ChatInterface.tsx)의 남은 공간을 채우도록 합니다.
    // overflow-y-auto: 내용이 넘칠 경우 세로 스크롤바를 자동으로 표시합니다.
    // max-h-[70vh]: 메시지 목록의 최대 높이를 화면 높이의 70%로 제한합니다. 필요에 따라 max-h-[400px] 등으로 변경하세요.
    // p-4, bg-blue, shadow-inner: 가독성을 높이기 위한 예시 스타일입니다.
    <div
      role="log"
      aria-live="polite"
      className="flex-1 overflow-y-auto max-h-[70vh] p-4 bg-white shadow-inner space-y-3"
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {/* 💡 이 div는 메시지 목록의 가장 마지막 요소로, 여기에 스크롤을 내릴 것입니다. */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

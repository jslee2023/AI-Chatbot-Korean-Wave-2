// src/components/ChatInterface.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { initChat, sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

const API_KEY_ENV = 'GOOGLE_GEMINI_API_KEY';

const ChatInterface: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... (기존 초기화 및 전송 로직은 그대로 유지) ...
  useEffect(() => { /* ... */ }, []);
  const handleSendMessage = useCallback(async (text: string) => { /* ... */ }, [chat, isLoading]);
  const placeholder = useMemo(() => { /* ... */ }, [chat, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden">
      {/* 메시지 리스트 */}
      <MessageList messages={messages} isLoading={isLoading} /> {/* isLoading prop 추가 전달 */}

      {/* 로딩 인디케이터 */}
      {isLoading && (
        // 💡 수정 지점: 'p-4' 클래스를 제거하거나 'py-2' 등으로 줄여보세요.
        // 여기서는 완전히 제거하여 MessageList의 패딩과 겹치지 않게 합니다.
        <div className="flex justify-center"> {/* 'p-4' 클래스 제거 */}
          <LoadingIndicator />
        </div>
      )}

      {/* 에러 배너 */}
      {error && (
        <div className="px-4 py-2 text-red-400 text-sm bg-red-900/50" role="alert" aria-live="polite">
          <p>
            <strong>오류:</strong> {error}
          </p>
        </div>
      )}

      {/* 입력창 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !chat}
        placeholder={placeholder}
        isSending={isLoading}
      />
    </div>
  );
};

export default ChatInterface;

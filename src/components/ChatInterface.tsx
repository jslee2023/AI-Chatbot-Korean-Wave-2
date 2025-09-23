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

  // 초기화
  useEffect(() => {
    const chatInstance = initChat();
    if (chatInstance) {
      setChat(chatInstance);
      setMessages([
        {
          id: 'init',
          sender: Sender.Bot,
          text: '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!',
          // timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      const apiKeyError = `Google Gemini API 키가 설정되지 않았습니다. 이 앱을 사용하려면 관리자가 \`${API_KEY_ENV}\` 환경 변수를 설정해야 합니다.`;
      setMessages([
        {
          id: 'init-error',
          sender: Sender.Bot,
          text: `**초기화 오류:**\n${apiKeyError}`,
          // timestamp: new Date().toISOString(),
        },
      ]);
      setError(apiKeyError);
    }
  }, []);

  // 전송
  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat || isLoading) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: trimmed,
      // timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, sender: Sender.Bot, text: '' /*, timestamp: new Date().toISOString()*/ },
    ]);

    try {
      const stream = await sendMessageStream(chat, trimmed);
      let fullText = '';
      for await (const chunk of stream as any) {
        if (chunk?.text) {
          fullText += chunk.text;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: fullText } : msg))
          );
        }
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message || 'An unexpected error occurred.' : 'An unexpected error occurred.';
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: `오류: ${errorMessage}` } : msg))
      );
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  // 입력창 placeholder 메모
  const placeholder = useMemo(() => {
    if (!chat) return '채팅을 초기화 중입니다...';
    if (isLoading) return '응답을 기다리는 중...';
    return '한류에 대해 궁금한 점을 물어보세요...';
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden">
      {/* 메시지 리스트 */}
      <MessageList messages={messages} />

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="flex justify-center p-4">
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

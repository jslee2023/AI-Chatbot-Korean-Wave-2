import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { initChat, sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

// 환경 변수 및 에러 메시지 상수
const API_KEY_ERROR = 'GOOGLE_GEMINI_API_KEY';
const INITIAL_BOT_MESSAGE = '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!';
const INITIALIZATION_ERROR = `**초기화 오류:**\nGoogle Gemini API 키가 설정되지 않았습니다. 관리자가 \`${API_KEY_ERROR}\` 환경 변수를 설정해야 합니다.`;

interface ChatInterfaceProps {
  // 필요에 따라 props를 추가할 수 있습니다
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  // State 정의
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 메시지 업데이트 후 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 채팅 초기화
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chatInstance = initChat();
        if (chatInstance) {
          setChat(chatInstance);
          setMessages([
            {
              id: 'init',
              sender: Sender.Bot,
              text: INITIAL_BOT_MESSAGE,
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          throw new Error(API_KEY_ERROR);
        }
      } catch (error) {
        console.error('Chat initialization failed:', error);
        setMessages([
          {
            id: 'init-error',
            sender: Sender.Bot,
            text: INITIALIZATION_ERROR,
            timestamp: new Date().toISOString(),
          },
        ]);
        setError(INITIALIZATION_ERROR);
      }
    };

    initializeChat();
  }, []);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat || isLoading || !text.trim()) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // 봇 응답 플레이스홀더 추가
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: ChatMessage = {
      id: botMessageId,
      sender: Sender.Bot,
      text: '',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const stream = await sendMessageStream(chat, text);
      let fullText = '';

      for await (const chunk of stream) {
        if (chunk.text) {
          fullText += chunk.text;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId 
                ? { ...msg, text: fullText, timestamp: new Date().toISOString() }
                : msg
            )
          );
        }
      }

      // 최종 메시지 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId 
            ? { ...msg, text: fullText, timestamp: new Date().toISOString() }
            : msg
        )
      );
    } catch (error: any) {
      const errorMessage = error.message || '예상치 못한 오류가 발생했습니다.';
      console.error('Message sending failed:', error);
      
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId 
            ? { ...msg, text: `오류: ${errorMessage}`, timestamp: new Date().toISOString() }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  // 에러 메시지 닫기
  const handleErrorDismiss = useCallback(() => {
    setError(null);
  }, []);

  // 초기화 상태 확인
  const isInitialized = chat !== null || messages.length > 0;

  return (
    <div className="flex flex-col flex-grow h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* 메시지 리스트 */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <LoadingIndicator />
        </div>
      )}

      {/* 에러 알림 */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                <strong>오류:</strong> {error}
              </p>
            </div>
            <button
              onClick={handleErrorDismiss}
              className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 메시지 입력 */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading || !isInitialized}
          placeholder={
            !isInitialized 
              ? "채팅을 초기화 중입니다..." 
              : isLoading 
                ? "응답을 기다리는 중..." 
                : "한류에 대해 궁금한 점을 물어보세요..."
          }
        />
      </div>
    </div>
  );
};

export default ChatInterface;

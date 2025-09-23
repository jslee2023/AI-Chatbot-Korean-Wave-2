import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { initChat, sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

// 환경 변수 및 초기 메시지
const API_KEY_ERROR = 'GOOGLE_GEMINI_API_KEY';
const INITIAL_BOT_MESSAGE =
  '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!';
const INITIALIZATION_ERROR = `**초기화 오류:**\nGoogle Gemini API 키가 설정되지 않았습니다. 관리자가 \`${API_KEY_ERROR}\` 환경 변수를 설정해야 합니다.`;

// 보조 컴포넌트: 에러 배너
const ErrorBanner: React.FC<{
  error: string;
  onClose: () => void;
  onRetry?: () => void;
}> = ({ error, onClose, onRetry }) => {
  return (
    <div
      className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800"
      role="alert"
      aria-live="polite"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"
            aria-hidden="true"
          />
          <p className="text-red-700 dark:text-red-300 text-sm">
            <strong>오류:</strong> {error}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRetry ? (
            <button
              onClick={onRetry}
              className="px-2 py-0.5 rounded text-red-600 dark:text-red-200 hover:bg-red-100/60 dark:hover:bg-red-800/30 text-xs font-medium"
            >
              다시 시도
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="ml-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium"
            aria-label="오류 메시지 닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// 스크롤 앵커 훅: 자동 스크롤 관리
function useAutoScroll(containerRef: React.RefObject<HTMLDivElement>) {
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
      setAutoScroll(nearBottom);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, [containerRef]);

  return { autoScroll, scrollToBottom, setAutoScroll };
}

const ChatInterface: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<string>(''); // 실패 시 복원용
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { autoScroll, scrollToBottom } = useAutoScroll(listContainerRef);

  // 스트림 취소용 컨트롤러
  const currentAbortRef = useRef<AbortController | null>(null);

  const isInitialized = chat !== null || messages.length > 0;

  // 초기화
  const initializeChat = useCallback(async () => {
    try {
      setError(null);
      const chatInstance = initChat();
      if (!chatInstance) throw new Error(API_KEY_ERROR);

      setChat(chatInstance);
      setMessages([
        {
          id: 'init',
          sender: Sender.Bot,
          text: INITIAL_BOT_MESSAGE,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      console.error('Chat initialization failed:', e);
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
  }, []);

  useEffect(() => {
    initializeChat();
    // 언마운트 시 스트림 취소
    return () => {
      currentAbortRef.current?.abort();
    };
  }, [initializeChat]);

  // 메시지 추가/업데이트 시 자동 스크롤
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom('smooth');
    }
  }, [messages, autoScroll, scrollToBottom]);

  // 전송
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!chat || isLoading || !text.trim()) return;

      setLastInput(text);
      setIsLoading(true);
      setError(null);

      // 사용자 메시지
      const userMessage: ChatMessage = {
        id: `${Date.now()}-u`,
        sender: Sender.User,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      // 봇 플레이스홀더
      const botMessageId = `${Date.now()}-b`;
      const botPlaceholder: ChatMessage = {
        id: botMessageId,
        sender: Sender.Bot,
        text: '',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, botPlaceholder]);

      // 기존 스트림 중단
      currentAbortRef.current?.abort();
      const aborter = new AbortController();
      currentAbortRef.current = aborter;

      try {
        const stream = await sendMessageStream(chat, text, { signal: aborter.signal } as any);
        let fullText = '';
        let frameReq: number | null = null;
        let pendingUpdate = '';

        const flush = () => {
          if (!pendingUpdate) return;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, text: pendingUpdate, timestamp: new Date().toISOString() }
                : m
            )
          );
          pendingUpdate = '';
          frameReq = null;
        };

        for await (const chunk of stream) {
          if (aborter.signal.aborted) break;
          if (chunk?.text) {
            fullText += chunk.text;
            pendingUpdate = fullText;
            if (frameReq == null) {
              frameReq = requestAnimationFrame(flush);
            }
          }
        }

        // 마지막 반영
        if (!aborter.signal.aborted) {
          if (frameReq != null) cancelAnimationFrame(frameReq);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, text: fullText, timestamp: new Date().toISOString() }
                : m
            )
          );
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // 새 요청으로 취소된 경우: 플레이스홀더를 유지하거나 “취소됨” 처리 가능
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, text: '요청이 취소되었습니다.', timestamp: new Date().toISOString() }
                : m
            )
          );
        } else {
          const errorMessage = err?.message || '예상치 못한 오류가 발생했습니다.';
          console.error('Message sending failed:', err);
          setError(errorMessage);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, text: `오류: ${errorMessage}`, timestamp: new Date().toISOString() }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [chat, isLoading]
  );

  // 에러 닫기
  const handleErrorDismiss = useCallback(() => setError(null), []);

  // 재시도: 마지막 입력 복원 전송
  const handleRetry = useCallback(() => {
    if (lastInput) {
      handleSendMessage(lastInput);
    } else if (!chat) {
      initializeChat();
    }
  }, [lastInput, handleSendMessage, chat, initializeChat]);

  const placeholder = useMemo(() => {
    if (!isInitialized) return '채팅을 초기화 중입니다...';
    if (isLoading) return '응답을 기다리는 중...';
    return '한류에 대해 궁금한 점을 물어보세요...';
  }, [isInitialized, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* 에러 배너 */}
      {error && (
        <ErrorBanner error={error} onClose={handleErrorDismiss} onRetry={handleRetry} />
      )}

      {/* 메시지 리스트 */}
      <div
        ref={listContainerRef}
        className="flex-grow overflow-y-auto px-4 py-2"
        aria-live="polite"
        role="log"
      >
        <MessageList messages={messages} />
      </div>

      {/* 로딩 인디케이터: 하단 고정 영역 */}
      {isLoading && (
        <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <LoadingIndicator />
        </div>
      )}

      {/* 메시지 입력 */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || !isInitialized}
          placeholder={placeholder}
          isSending={isLoading}
          sendShortcut="enter"
          maxLength={4000}
          ariaDescription="Enter로 전송, Shift+Enter로 줄바꿈"
        />
      </div>
    </div>
  );
};

export default ChatInterface;

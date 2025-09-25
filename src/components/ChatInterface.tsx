// src/components/ChatInterface.tsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ChatSession, GenerateContentStreamResult } from '@google/generative-ai';
import { initChat, sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

// API 키 환경 변수 이름을 상수로 정의
const API_KEY_ENV_NAME = 'GOOGLE_GEMINI_API_KEY';

const ChatInterface: React.FC = () => {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 💡 useRef를 사용하여 메시지 ID 카운터를 관리합니다.
  // 이 값은 렌더링에 영향을 주지 않으므로 상태가 될 필요가 없습니다.
  const messageIdRef = useRef<number>(0);

  // 챗 세션 초기화 및 초기 메시지 설정 (컴포넌트 마운트 시 한 번 실행)
  useEffect(() => {
    const chatInstance = initChat();
    if (chatInstance) {
      setChat(chatInstance);
      setMessages([
        {
          id: `bot-init-${messageIdRef.current++}`,
          sender: Sender.Bot,
          text: '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!',
        },
      ]);
      setError(null);
    } else {
      const apiKeyErrorMessage = `Google Gemini API 키가 설정되지 않았습니다. 이 앱을 사용하려면 관리자가 \`${API_KEY_ENV_NAME}\` 환경 변수를 설정해야 합니다.`;
      setMessages([
        {
          id: `bot-error-${messageIdRef.current++}`,
          sender: Sender.Bot,
          text: `**초기화 오류:**\n${apiKeyErrorMessage}`,
        },
      ]);
      setError(apiKeyErrorMessage);
    }
  }, []);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(async (text: string) => {
    // 챗 세션이 없거나 이미 로딩 중이면 전송 방지
    if (!chat || isLoading) {
      console.warn("메시지를 보낼 수 없습니다. 챗 세션이 없거나 로딩 중입니다.");
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) return; // 빈 메시지는 전송 안 함

    // 사용자 메시지를 메시지 목록에 추가
    const userMessage: ChatMessage = {
      id: `user-${messageIdRef.current++}`, // 고유 ID 생성 (useRef 활용)
      sender: Sender.User,
      text: trimmedText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null); // 새로운 요청 전 에러 상태 초기화

    // 봇 응답을 위한 빈 메시지 추가 (스트림으로 채워질 예정)
    const botMessageId = `bot-${messageIdRef.current++}`;
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, sender: Sender.Bot, text: '' },
    ]);

    try {
      // Gemini API로 메시지 전송 (스트림 방식)
      // GenerateContentStreamResult 타입 사용으로 타입 안정성 강화
      const result: GenerateContentStreamResult = await sendMessageStream(chat, trimmedText);
      let fullBotResponse = '';

      // 스트림 응답 처리
      for await (const chunk of result.stream) {
        // chunk.text는 ContentPart.text 타입으로 추정되나, 안전하게 접근
        const chunkText = chunk.text || '';
        if (chunkText) {
          fullBotResponse += chunkText;
          // 스트림 중간중간 메시지 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: fullBotResponse } : msg
            )
          );
        }
      }

      // 스트림이 완료된 후, 응답이 비어있다면 "응답 없음" 처리
      if (fullBotResponse === '') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: "죄송합니다, 응답을 받지 못했습니다." } : msg
          )
        );
      }

    } catch (e: unknown) {
      console.error("메시지 전송 중 오류 발생:", e);
      const errorMessage =
        e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
      setError(`메시지 처리 오류: ${errorMessage}`);
      // 봇 응답 메시지에 오류 내용 반영
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: `⚠️ 오류: ${errorMessage}` } : msg
        )
      );
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  }, [chat, isLoading]);

  // MessageInput 컴포넌트에 전달될 placeholder 텍스트 설정
  const messageInputPlaceholder = useMemo(() => {
    if (!chat) return '챗봇을 초기화 중입니다...';
    if (isLoading) return '응답을 기다리는 중...';
    if (error) return '오류가 발생하여 메시지를 보낼 수 없습니다.';
    return '한류에 대해 궁금한 점을 물어보세요...';
  }, [chat, isLoading, error]);

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden">
      {/* 메시지 리스트 컴포넌트 */}
      {/* MessageList에 isLoading을 전달하여 스크롤 로직에 활용하도록 합니다. */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* 로딩 인디케이터 (isLoading 상태일 때만 표시) */}
      {isLoading && (
        <div className="flex justify-center py-2">
          <LoadingIndicator />
        </div>
      )}

      {/* 에러 배너 (에러가 있을 때만 표시) */}
      {error && (
        <div className="px-4 py-2 text-red-400 text-sm bg-red-900/50" role="alert" aria-live="polite">
          <p>
            <strong>오류:</strong> {error}
          </p>
        </div>
      )}

      {/* 메시지 입력창 컴포넌트 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !chat || !!error} // 로딩 중이거나 챗 세션이 없거나 에러가 발생하면 비활성화
        placeholder={messageInputPlaceholder}
        isSending={isLoading} // MessageInput 내에서도 로딩 스피너 표시용
      />
    </div>
  );
};

export default ChatInterface;

// src/components/ChatInterface.tsx (예시 – 실제 코드에 맞게 통합)
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Sender, ChatMessage } from '../types';
import { createLoadingMessage } from './Message'; // 헬퍼 import
import { initChat, sendMessageStream } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로딩 상태 변경 시 messages 업데이트 (useEffect로 동기화)
  useEffect(() => {
    if (isLoading) {
      // 로딩 시작: messages 끝에 더미 로딩 메시지 추가
      setMessages(prev => [...prev, createLoadingMessage()]);
    } else {
      // 로딩 종료: 마지막 로딩 메시지 제거 (ID로 필터링)
      setMessages(prev => prev.filter(m => !m.id.startsWith('loading-')));
    }
  }, [isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: text.trim(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true); // 로딩 시작 (useEffect 트리거)

    try {
      const chat = initChat();
      if (chat) {
        const stream = await sendMessageStream(chat, text);
        // 스트림 처리 (실제 구현: stream 데이터를 누적해 text 빌드)
        let responseText = ''; // 예시: 스트림에서 텍스트 추출
        for await (const chunk of stream) {
          responseText += chunk.text(); // 실제 파싱 로직
        }

        // 로딩 종료 + AI 응답 추가
        setIsLoading(false); // useEffect로 로딩 메시지 제거
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: Sender.Bot,
          text: responseText,
        };
        setMessages(prev => [...prev.slice(0, -1), aiMessage]); // 로딩 제거 후 AI 추가
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false); // 에러 시 로딩 종료
      // 에러 메시지 추가 (옵션)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: Sender.Bot,
        text: '죄송합니다. 응답을 생성할 수 없습니다. 다시 시도해주세요.',
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} /> {/* isLoading으로 스크롤 트리거 */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading} 
        isSending={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;

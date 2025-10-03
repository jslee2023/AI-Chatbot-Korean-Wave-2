// src/components/ChatInterface.tsx
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList'; // default import
import MessageInput from './MessageInput'; // default import
import { Sender, ChatMessage } from '../types';
import { createLoadingMessage } from './Message'; // named import (헬퍼)
import { initChat, sendMessageStream } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로딩 상태 변경 시 messages 업데이트
  useEffect(() => {
    const chatInstance = initChat();
    if (chatInstance) {
      setChat(chatInstance);
      setMessages([
        {
          id: 'init',
          sender: Sender.Bot,
          text: '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!',
        },
      ]);
    } else {
      // FIX: Update error message to reflect the correct environment variable name.
      const apiKeyError = "Google Gemini API 키가 설정되지 않았습니다. 이 앱을 사용하려면 관리자가 `API_KEY` 환경 변수를 설정해야 합니다.";
      setMessages([
        {
          id: 'init-error',
          sender: Sender.Bot,
          text: `**초기화 오류:**\n${apiKeyError}`,
        }
      ]);
    }
  }, []);
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: text.trim(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true); // 로딩 시작

    try {
      const chat = initChat();
      if (chat) {
        const stream = await sendMessageStream(chat, text);
        let responseText = ''; // 스트림 누적
        // 스트림 처리 (getter text 사용)
        for await (const chunk of stream) {
          if (chunk.text) { // undefined 체크
            responseText += chunk.text; // () 제거: getter
          }
        }

        // 로딩 종료 + AI 응답 추가
        setIsLoading(false);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: Sender.Bot,
          text: responseText || '응답을 받지 못했습니다.', // fallback
        };
        setMessages(prev => [...prev.slice(0, -1), aiMessage]); // 로딩 제거 후 추가
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
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
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading} 
        isSending={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;

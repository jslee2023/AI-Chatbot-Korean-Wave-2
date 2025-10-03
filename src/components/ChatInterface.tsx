// src/components/ChatInterface.tsx
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList'; // default import
import MessageInput from './MessageInput'; // default import
import { Sender, ChatMessage } from '../types';
import { createLoadingMessage } from './Message'; // named import (사용됨)
import { Chat } from '@google/genai'; // Chat 타입 import (필요 시)
import { initChat, sendMessageStream } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null); // chat 세션 상태 추가 (setChat 정의)

  // 로딩 상태 변경 시 messages 업데이트
  useEffect(() => {
    if (isLoading) {
      // 로딩 시작: messages 끝에 더미 로딩 메시지 추가 (사용됨)
      setMessages(prev => [...prev, createLoadingMessage()]);
    } else {
      // 로딩 종료: 마지막 로딩 메시지 제거
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

    setIsLoading(true); // 로딩 시작

    try {
      let currentChat = chat;
      if (!currentChat) {
        currentChat = initChat();
        if (!currentChat) throw new Error('Chat initialization failed');
        setChat(currentChat); // setChat 사용
      }

      const stream = await sendMessageStream(currentChat, text);
      let responseText = ''; // 스트림 누적
      // 스트림 처리 (getter text 사용)
      for await (const chunk of stream) {
        if (chunk.text) {
          responseText += chunk.text; // () 제거: getter
        }
      }

      // 로딩 종료 + AI 응답 추가
      setIsLoading(false);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: responseText || '응답을 받지 못했습니다.',
      };
      setMessages(prev => [...prev.slice(0, -1), aiMessage]); // 로딩 제거 후 추가
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

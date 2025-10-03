// src/components/ChatInterface.tsx
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Sender, ChatMessage } from '../types';
import { createLoadingMessage } from './Message'; // named import (useEffect에서 사용됨)
import { initChat, sendMessageStream } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null); // chat 세션 상태 추가 (setChat 정의, 타입 any로 간단히)

  // 로딩 상태 변경 시 messages 업데이트 (createLoadingMessage 사용)
  useEffect(() => {
    if (isLoading) {
      const loadingMsg = createLoadingMessage(); // 명확히 호출 (dead code 해결)
      setMessages(prev => [...prev, loadingMsg]);
    } else {
      setMessages(prev => prev.filter(m => !m.id.startsWith('loading-'))); // 로딩 제거
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
        setChat(currentChat); // setChat 사용 (정의됨)
      }

      const stream = await sendMessageStream(currentChat, text);
      let responseText = '';
      // 스트림 처리
      for await (const chunk of stream) {
        if (chunk && chunk.text) {
          responseText += chunk.text; // getter 사용
        }
      }

      // 로딩 종료 + AI 응답 추가
      setIsLoading(false);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: responseText || '응답을 받지 못했습니다.',
      };
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1); // 로딩 제거
        return [...withoutLoading, aiMessage];
      });
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: Sender.Bot,
        text: '죄송합니다. 응답을 생성할 수 없습니다. 다시 시도해주세요.',
      };
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1);
        return [...withoutLoading, errorMessage];
      });
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

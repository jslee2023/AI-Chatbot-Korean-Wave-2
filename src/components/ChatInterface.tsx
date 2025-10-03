// src/components/ChatInterface.tsx
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Sender, ChatMessage } from '../types';
import { createLoadingMessage } from './Message';
import { initChat, sendMessageStream } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  // 초기 웰컴 메시지 추가
  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome-1',
    sender: Sender.Bot,
    text: "안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!\n\nHello! I'm the Hallyu Master Chatbot. Ask me anything about Korean culture, K-pop, dramas, movies, and more!",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]); // 초기 배열에 웰컴 추가
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);

  // 로딩 상태 변경 시 messages 업데이트
  useEffect(() => {
    if (isLoading) {
      const loadingMsg = createLoadingMessage();
      setMessages(prev => [...prev, loadingMsg]);
    } else {
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

    setIsLoading(true);

    try {
      let currentChat = chat;
      if (!currentChat) {
        currentChat = initChat();
        if (!currentChat) throw new Error('Chat initialization failed');
        setChat(currentChat);
      }

      const stream = await sendMessageStream(currentChat, text);
      let responseText = '';
      for await (const chunk of stream) {
        if (chunk && chunk.text) {
          responseText += chunk.text;
        }
      }

      setIsLoading(false);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: responseText || '응답을 받지 못했습니다.',
      };
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1);
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
    <div className="flex flex-col flex-grow h-full overflow-hidden">
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

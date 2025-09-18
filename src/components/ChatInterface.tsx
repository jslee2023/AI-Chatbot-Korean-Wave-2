import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { initChat, sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Sender } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

const ChatInterface: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    const botMessageId = (Date.now() + 1).toString();
    // Add a placeholder for the bot's response
    setMessages((prev) => [...prev, { id: botMessageId, sender: Sender.Bot, text: '' }]);

    try {
      const stream = await sendMessageStream(chat, text);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: `오류: ${errorMessage}` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden">
      <MessageList messages={messages} />
       {isLoading && <LoadingIndicator />}
      {error && (
        <div className="px-4 py-2 text-red-400 text-sm bg-red-900/50">
          <p><strong>오류:</strong> {error}</p>
        </div>
      )}
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading || !chat} />
    </div>
  );
};

export default ChatInterface;

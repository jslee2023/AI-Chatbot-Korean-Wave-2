// src/components/MessageInput.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SendIcon } from './IconComponents';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>; // 메시지 전송 함수 (async 지원)
  disabled: boolean; // 입력 비활성화 여부
  placeholder?: string; // placeholder 텍스트 (옵셔널)
  isSending?: boolean; // 메시지 전송 중 여부 (로딩 상태)
}

const MessageInput: React.FC<MessageInputProps> = React.memo(
  ({ onSendMessage, disabled, placeholder = 'Ask about anything Korean...', isSending = false }) => {
    const [input, setInput] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // 전송 핸들러 (form submit 또는 버튼 클릭)
    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled && !isSending) {
          await onSendMessage(input.trim());
          setInput(''); // 입력 필드 초기화
        }
      },
      [input, onSendMessage, disabled, isSending]
    );

    // 텍스트 영역의 높이를 내용에 맞게 자동 조절
    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
      }
    }, [input]);

    // Enter 키 눌렀을 때 메시지 전송 (Shift + Enter는 줄바꿈)
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled && !isSending) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit, disabled, isSending]
    );

    return (
      <div className="p-4 border-t border-gray-700 bg-gray-900/50 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-grow bg-gray-700 dark:bg-gray-800 text-white rounded-lg p-3 resize-none min-h-[40px] max-h-[120px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50"
            disabled={disabled || isSending}
            aria-label="메시지 입력"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled || isSending}
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"
            aria-label="메시지 전송"
          >
            {isSending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;

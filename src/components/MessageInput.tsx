// src/components/MessageInput.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>; // 메시지 전송 함수
  disabled: boolean; // 입력 비활성화 여부
  placeholder: string; // placeholder 텍스트
  isSending: boolean; // 메시지 전송 중 여부 (로딩 상태)
}

const MessageInput: React.FC<MessageInputProps> = React.memo(
  ({ onSendMessage, disabled, placeholder, isSending }) => {
    const [input, setInput] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // 전송 버튼 클릭 또는 Enter 키 입력 시 메시지 전송
    const handleSend = useCallback(() => {
      if (input.trim() && !disabled) {
        onSendMessage(input.trim());
        setInput(''); // 입력 필드 초기화
      }
    }, [input, onSendMessage, disabled]);

    // 텍스트 영역의 높이를 내용에 맞게 자동 조절
    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto'; // 높이 초기화
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'; // 내용에 맞춰 높이 조절
      }
    }, [input]); // 입력값이 변경될 때마다 실행

    // Enter 키 눌렀을 때 메시지 전송 (Shift + Enter는 줄바꿈)
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
          e.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
          handleSend();
        }
      },
      [handleSend, disabled]
    );

    return (
      <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <textarea
          ref={textAreaRef}
          className="flex-grow resize-none overflow-hidden h-10 min-h-[40px] max-h-[120px] rounded-full px-4 py-2 mr-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          rows={1} // 초기 높이를 1줄로 설정
          aria-label="메시지 입력"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled || isSending}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-200
          ${
            !input.trim() || disabled || isSending
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;

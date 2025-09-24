import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { SendIcon } from './IconComponents';

type SendShortcut = 'enter' | 'mod+enter'; // enter: Enter=전송, Shift+Enter 줄바꿈 / mod+enter: Cmd/Ctrl+Enter 전송

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isSending?: boolean;           // 로딩/전송 중 상태
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;            // 글자 수 제한
  sendShortcut?: SendShortcut;   // 단축키 정책
  minRows?: number;
  maxRows?: number;
  ariaDescription?: string;      // SR 전용 안내 문구
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  isSending = false,
  placeholder = '무엇이든 한국에 관해 물어보세요…',
  autoFocus = false,
  maxLength = 4000,
  sendShortcut = 'enter',
  minRows = 1,
  maxRows = 6,
  ariaDescription,
}) => {
  const [input, setInput] = useState('');
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const labelId = useId();
  const descId = useId();

  const isDisabled = disabled || isSending;
  const trimmed = input.trim();
  const canSend = !!trimmed && !isDisabled;

  // 자동 포커스
  useEffect(() => {
    if (autoFocus && textRef.current) textRef.current.focus();
  }, [autoFocus]);

  // textarea 자동 높이 조절
  const autoResize = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(el).lineHeight || '20', 10);
    const maxHeight = lineHeight * maxRows + 8; // 약간의 패딩 여유
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [maxRows]);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  // 입력 변경
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      setInput(val);
    } else {
      setInput(val.slice(0, maxLength));
    }
  }, [maxLength]);

  // 전송
  const submit = useCallback(() => {
    if (!canSend) return;
    onSendMessage(trimmed);
    setInput('');
    // 전송 후 높이 초기화
    requestAnimationFrame(autoResize);
  }, [canSend, onSendMessage, trimmed, autoResize]);

  // 단축키 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 모션 축소 환경에서도 키 이벤트는 동일
    if (sendShortcut === 'enter') {
      // Enter = 전송, Shift+Enter = 줄바꿈
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    } else {
      // mod+enter = 전송 (Mac Cmd, Win/Linux Ctrl)
      const isMod = e.metaKey || e.ctrlKey;
      if (e.key === 'Enter' && isMod) {
        e.preventDefault();
        submit();
      }
    }
  }, [sendShortcut, submit]);

  const shortcutHint = useMemo(() => {
    return sendShortcut === 'enter'
      ? 'Enter로 전송, Shift+Enter로 줄바꿈'
      : 'Cmd/Ctrl+Enter로 전송, Enter로 줄바꿈';
  }, [sendShortcut]);

  const remaining = maxLength - input.length;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    submit();
  }, [submit]);

  return (
    <div className="p-4 border-t border-gray-500 bg-gray-900/50 rounded-b-2xl">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* 보조기술용 라벨(시각적으로 숨김) */}
        <label id={labelId} htmlFor="chat-input" className="sr-only">
          메시지 입력
        </label>

        <div className="flex-1 flex flex-col">
          <textarea
            id="chat-input"
            ref={textRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={minRows}
            aria-labelledby={labelId}
            aria-describedby={descId}
            aria-invalid={false}
            spellCheck={true}
            disabled={isDisabled}
            className={[
              'flex-grow w-full bg-gray-700 text-white rounded-lg px-3 py-2',
              'resize-none',
              'placeholder:text-gray-300/70',
              'focus:outline-none focus:ring-2 focus:ring-purple-500',
              'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
              'selection:bg-purple-500/30',
              'break-words [overflow-wrap:anywhere]',
            ].join(' ')}
            style={{ maxHeight: '50vh' }}
          />

          {/* 하단 보조 정보: 단축키 + 글자 수 */}
          <div id={descId} className="mt-1 flex items-center justify-between text-xs text-gray-300/80">
            <span>{ariaDescription ?? shortcutHint}</span>
            <span aria-live="polite">
              {remaining.toLocaleString()}자 남음
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={[
            'relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full',
            'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-transform transition-opacity duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500',
            'motion-reduce:transition-none motion-reduce:hover:opacity-100',
            canSend ? 'hover:scale-105 active:scale-95' : '',
          ].join(' ')}
          aria-label="메시지 전송"
          aria-live="off"
        >
          {/* 로딩 스피너(선택): isSending 상태 시 교체 */}
          {isSending ? (
            <span
              className="block w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          ) : (
            <SendIcon ariaHidden />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

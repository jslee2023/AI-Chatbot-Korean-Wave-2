// src/components/IconComponents.tsx
import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  ariaHidden?: boolean; // 스크린 리더를 위한 aria-hidden 속성
}

// 봇 아이콘 (예: 로딩 인디케이터나 헤더 아바타에 사용)
export const BotIcon: React.FC<IconProps> = React.memo(({ 
  size = 20, 
  className = '', 
  ariaHidden = false 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={`fill-current text-white dark:text-gray-100 ${className}`}
    aria-hidden={ariaHidden}
  >
    <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z"/>
    <path d="M7 16l-3.268 3.268a2 2 0 1 0 2.828 2.828L12 16h-5Z"/>
    <path d="M17 16l3.268 3.268a2 2 0 1 1-2.828 2.828L12 16h5Z"/>
  </svg>
));

// 사용자 아이콘 (예: 사용자 메시지 옆에 표시)
export const UserIcon: React.FC<IconProps> = React.memo(({ 
  size = 20, 
  className = '', 
  ariaHidden = false 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={`fill-current text-gray-800 dark:text-gray-200 ${className}`}
    aria-hidden={ariaHidden}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
));

// 전송 아이콘 (메시지 입력 버튼에 사용)
export const SendIcon: React.FC<IconProps> = React.memo(({ 
  size = 20, 
  className = '', 
  ariaHidden = false 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={`fill-current ${className}`}
    aria-hidden={ariaHidden}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
));

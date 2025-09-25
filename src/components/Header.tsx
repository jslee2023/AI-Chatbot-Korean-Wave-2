// src/components/Header.tsx
import React from 'react';

type HeaderProps = {
  title?: string;
  logoPulse?: boolean;
  sticky?: boolean;
};

const Header: React.FC<HeaderProps> = React.memo(({
  title = 'Hallyu AI Chatbot',
  logoPulse = true,
  sticky = true
}) => {
  return (
    <header
      role="banner"
      className={[
        'w-full',
        sticky ? 'sticky top-0 z-40' : '', // 현재 구조에서는 sticky가 큰 의미가 없을 수 있습니다.
        'bg-gray-500 dark:bg-gray-950',    // 배경색 변경 (불투명)
        'rounded-t-xl',                    // 상단 모서리 둥글게 (App.tsx와 일관성)
        'border-b border-gray-600 dark:border-gray-700',
        'shadow-md'
      ].join(' ')} // 배열을 join(' ')으로 연결하여 Tailwind 클래스 문자열 생성
    >
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        aria-label="사이트 헤더"
      >
        <div className="h-14 sm:h-16 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {/* 로고 아이콘 */}
            <div
              aria-hidden="true"
              className={[
                'w-3.5 h-3.5 rounded-full',
                'bg-gradient-to-r from-teal-200 to-cyan-300', // 아이콘 그라데이션 색상
                logoPulse ? 'animate-pulse' : '',
                'ring-2 ring-white/60 dark:ring-gray-900/60'
              ].join(' ')}
            />
            {/* 타이틀 텍스트 */}
            <h1
              className={[
                'text-lg sm:text-xl font-bold',
                'text-transparent bg-clip-text',
                'bg-gradient-to-r from-cyan-200 to-blue-300', // 텍스트 그라데이션 색상
                'contrast-more:text-blue-500 contrast-more:bg-none' // 고대비 모드
              ].join(' ')}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

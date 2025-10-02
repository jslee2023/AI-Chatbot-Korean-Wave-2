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
        sticky ? 'sticky top-0 z-40' : '',
        'bg-gray-800/50 backdrop-blur-sm', // 반투명 배경 + 블러 효과 (새 코드 영감)
        'rounded-t-2xl',                   // 더 둥근 모서리 (새 코드)
        'border-b border-gray-700 dark:border-gray-800',
        'shadow-lg'                        // 강한 그림자 (새 코드)
      ].join(' ')}
    >
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        aria-label="사이트 헤더"
      >
        <div className="h-16 flex items-center justify-center"> {/* 고정 높이, 새 코드처럼 64px */}
          <div className="flex items-center gap-3"> {/* gap-3 유지, space-x-3 대신 */}
            {/* 로고 아이콘 */}
            <div
              aria-hidden="true"
              className={[
                'w-4 h-4 rounded-full',          // 크기 새 코드처럼 16px
                'bg-gradient-to-r from-teal-200 via-pink-300 to-purple-500', // 그라데이션 섞음 (청록 + 핑크-퍼플)
                logoPulse ? 'animate-pulse' : '',
                'ring-2 ring-white/60 dark:ring-gray-900/60' // 링 유지 (기존)
              ].join(' ')}
            />
            {/* 타이틀 텍스트 */}
            <h1
              className={[
                'text-xl font-bold',             // 고정 20px (새 코드), 반응형 생략으로 간결
                'text-transparent bg-clip-text',
                'bg-gradient-to-r from-cyan-200 via-purple-400 to-pink-500', // 그라데이션 섞음 (청색 + 퍼플-핑크)
                'contrast-more:text-purple-500 contrast-more:bg-none' // 고대비, 색상 조정
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

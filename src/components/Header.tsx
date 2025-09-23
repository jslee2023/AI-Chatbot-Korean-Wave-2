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
        // 배경: 적절한 투명도 + 블러, 다크/라이트 대응
        'backdrop-blur supports-[backdrop-filter]:backdrop-blur',
        'bg-white/60 dark:bg-gray-900/50',
        'border-b border-gray-200/80 dark:border-gray-700/70',
        'shadow-sm'
      ].join(' ')}
    >
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        aria-label="사이트 헤더"
      >
        <div className="h-14 sm:h-16 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {/* 접근성: 장식 아이콘에 aria-hidden, 대비 강화 */}
            <div
              aria-hidden="true"
              className={[
                'w-3.5 h-3.5 rounded-full',
                'bg-gradient-to-r from-pink-500 to-purple-500',
                logoPulse ? 'animate-pulse' : '',
                'ring-2 ring-white/60 dark:ring-gray-900/60'
              ].join(' ')}
            />
            {/* 텍스트: 고대비 모드에서도 가독성 유지되도록 fallback 색상 제공 */}
            <h1
              className={[
                'text-lg sm:text-xl font-bold',
                'text-transparent bg-clip-text',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                // 고대비 환경 대비: prefers-contrast로 폴백 색상
                'contrast-more:text-purple-600 contrast-more:bg-none'
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

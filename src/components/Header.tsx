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
        // 💡 배경: 이전보다 더 짙은 고정 배경색으로 변경. (투명도 및 블러 제거)
        'bg-gray-800 dark:bg-gray-950', // 원래: 'bg-white/60 dark:bg-gray-900/50'
        // 💡 상단 모서리 둥글게: App.tsx의 rounded-xl과 동일하게 맞춰 일관성 확보
        'rounded-t-xl',                   // 원래는 이 클래스 없음
        // 하단 테두리: 기존 테두리 유지
        'border-b border-gray-600 dark:border-gray-700', // 원래: 'border-gray-200/80 dark:border-gray-700/70'
        // 그림자: 기존 그림자 유지
        'shadow-md'                       // 원래: 'shadow-sm', 살짝 키움
      ].join(' ')}
    >
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        aria-label="사이트 헤더"
      >
        <div className="h-14 sm:h-16 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {/* 아이콘: 색상만 변경 예시 */}
            <div
              aria-hidden="true"
              className={[
                'w-3.5 h-3.5 rounded-full',
                'bg-gradient-to-r from-teal-400 to-cyan-500', // 💡 아이콘 그라데이션 색상 변경 (원래: from-pink-500 to-purple-500)
                logoPulse ? 'animate-pulse' : '',
                'ring-2 ring-white/60 dark:ring-gray-900/60'
              ].join(' ')}
            />
            {/* 텍스트: 그라데이션 대신 고정 색상으로 변경 예시 (혹은 다른 그라데이션) */}
            <h1
              className={[
                'text-lg sm:text-xl font-bold',
                'text-transparent bg-clip-text', // 💡 그라데이션 텍스트 유지
                'bg-gradient-to-r from-cyan-400 to-blue-500', // 💡 텍스트 그라데이션 색상 변경 (원래: from-purple-500 to-pink-500)
                'contrast-more:text-blue-600 contrast-more:bg-none' // 💡 고대비 모드 대비 색상도 변경 (원래: text-purple-600)
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

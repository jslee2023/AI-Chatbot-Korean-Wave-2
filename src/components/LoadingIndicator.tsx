import React from 'react';
import { BotIcon } from './IconComponents';

type LoadingIndicatorProps = {
  label?: string;          // 스크린리더용 메시지 (예: "응답 생성 중")
  compact?: boolean;       // 여백/크기 축소
  bubbleColorClass?: string; // 말풍선 배경 커스터마이즈
  dotColorClass?: string;    // 점 색상 커스터마이즈
  iconSize?: number | string;
};

const DOTS = 3;

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({
  label = '응답 생성 중',
  compact = false,
  bubbleColorClass = 'bg-gray-700/80',
  dotColorClass = 'bg-gray-300 dark:bg-gray-200',
  iconSize = 18,
}) => {
  const containerSpace = compact ? 'px-3 py-1.5 gap-1.5' : 'px-4 py-2 gap-2';
  const bubblePadding = compact ? 'p-2' : 'p-3';
  const dotSize = compact ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const avatarSize = compact ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <div className={`flex items-end ${containerSpace}`}>
      {/* 아바타 아이콘: 장식용 처리 */}
      <div
        className={`${avatarSize} flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md`}
        aria-hidden="true"
      >
        <BotIcon size={iconSize} ariaHidden />
      </div>

      {/* 라이브 영역: 스크린리더가 상태를 인지할 수 있도록 설정 */}
      <div
        className={`${bubbleColorClass} rounded-xl rounded-bl-none ${bubblePadding} flex items-center`}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        {/* 점 3개 로딩 애니메이션 */}
        <DancingDots
          count={DOTS}
          dotClassName={`${dotSize} ${dotColorClass} rounded-full`}
        />
        {/* 시각적으로 숨기고 스크린 리더에만 노출 */}
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;

/* 보조 컴포넌트: 점 애니메이션 */
type DancingDotsProps = {
  count?: number;
  dotClassName?: string;
  gapClassName?: string;
};

const DancingDots: React.FC<DancingDotsProps> = ({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-300 rounded-full',
  gapClassName = 'space-x-1.5',
}) => {
  // 모션 감소 환경에서는 애니메이션 제거
  const baseAnim = 'animate-pulse';
  const reducedMotion = 'motion-reduce:animate-none';

  return (
    <div className={`flex items-center ${gapClassName}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`${dotClassName} ${baseAnim} ${reducedMotion}`}
          style={{
            // CSS 변수나 tailwind keyframes를 쓰면 더 좋지만, 간단히 지연만 부여
            animationDelay: `${i * 0.18}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

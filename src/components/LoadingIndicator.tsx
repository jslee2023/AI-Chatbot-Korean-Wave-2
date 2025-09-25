// src/components/LoadingIndicator.tsx
import React from 'react';
import { BotIcon } from './IconComponents'; // BotIcon이 IconComponents.tsx에 있다고 가정

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
  // 말풍선 배경색을 'bg-transparent'로 설정하여 투명하게 만듭니다.
  bubbleColorClass = 'bg-transparent', // 👈 로딩 시 배경 변화를 없애는 핵심 지점
  // 점 색깔은 메시지 목록의 배경색(bg-white / dark:bg-gray-900)에 대비되도록 유지합니다.
  dotColorClass = 'bg-gray-700 dark:bg-gray-300', // 더 잘 보이도록 조정
  iconSize = 18,
}) => {
  const containerSpace = compact ? 'px-3 py-1.5 gap-1.5' : 'px-4 py-2 gap-2';
  const bubblePadding = compact ? 'p-0' : 'p-0'; // 배경이 없으므로 말풍선 패딩도 제거 또는 최소화
  const dotSize = compact ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const avatarSize = compact ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <div className={`flex items-end ${containerSpace}`}>
      {/* 아바타 아이콘 */}
      <div
        className={`${avatarSize} flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md`}
        aria-hidden="true"
      >
        <BotIcon size={iconSize} ariaHidden />
      </div>

      {/* 로딩 점과 라벨 */}
      <div
        className={`${bubbleColorClass} rounded-xl rounded-bl-none ${bubblePadding} flex items-center`}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <DancingDots // 👈 여기서 DancingDots를 사용합니다.
          count={DOTS}
          dotClassName={`${dotSize} ${dotColorClass} rounded-full`}
        />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;

/* 보조 컴포넌트: 점 애니메이션 (DancingDots) - 💡 이 부분이 파일에 포함되어야 합니다! */
type DancingDotsProps = {
  count?: number;
  dotClassName?: string;
  gapClassName?: string;
};

const DancingDots: React.FC<DancingDotsProps> = ({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-700 rounded-full', // 이 부분도 통일 (상위 dotColorClass와 일치)
  gapClassName = 'space-x-1.5',
}) => {
  // 모션 감소 환경에서는 애니메이션 제거
  const baseAnim = 'animate-pulse';
  const reducedMotion = 'motion-reduce:animate-none'; // Reduced Motion CSS

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

// src/components/LoadingIndicator.tsx
import React from 'react';
import { BotIcon } from './IconComponents';

type LoadingIndicatorProps = {
  label?: string;
  compact?: boolean;
  bubbleColorClass?: string;
  dotColorClass?: string;
  iconSize?: number | string;
};

const DOTS = 3;

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({
  label = '응답 생성 중',
  compact = false,
  // 💡 핵심 수정 지점: 말풍선 배경색을 'bg-transparent'로 설정하여 투명하게 만듭니다.
  bubbleColorClass = 'bg-transparent', // 👈 이 부분이 "회색 배경 변화"를 없애는 지점입니다!
  // 점 색깔은 메시지 목록의 배경색(bg-white / dark:bg-gray-900)에 대비되도록 유지합니다.
  dotColorClass = 'bg-gray-700 dark:bg-gray-300', // 더 잘 보이도록 조정
  iconSize = 18,
}) => {
  const containerSpace = compact ? 'px-3 py-1.5 gap-1.5' : 'px-4 py-2 gap-2';
  const bubblePadding = compact ? 'p-0' : 'p-0'; // 💡 배경이 없으므로 말풍선 패딩도 제거 또는 최소화
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
        // 💡 bubbleColorClass를 bg-transparent로 설정했으므로, 이 div 자체의 배경색은 없어집니다.
        // rounded-xl rounded-bl-none도 여전히 적용되지만, 배경색이 없으니 시각적으로 티가 나지 않습니다.
        className={`${bubbleColorClass} rounded-xl rounded-bl-none ${bubblePadding} flex items-center`}
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        <DancingDots
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

// DancingDots 컴포넌트는 위와 동일하므로 여기서는 생략합니다.
// DancingDots 컴포넌트의 dotClassName 기본값도 위 dotColorClass와 일치시켜 주는 것이 좋습니다.
/*
const DancingDots: React.FC<DancingDotsProps> = ({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-700 rounded-full', // 이 부분도 통일
  gapClassName = 'space-x-1.5',
}) => {
  // ...
};
*/

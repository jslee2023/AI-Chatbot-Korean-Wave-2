// src/components/LoadingIndicator.tsx
import React from 'react';
import { BotIcon } from './IconComponents';

type LoadingIndicatorProps = {
  label?: string;          // 스크린리더용 메시지 (예: "응답 생성 중")
  compact?: boolean;       // 여백/크기 축소 여부
  bubbleColorClass?: string; // 말풍선 배경색 클래스
  dotColorClass?: string;    // 점 색상 클래스
  iconSize?: number | string;
};

const DOTS = 3; // 점의 개수

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({
  label = '응답 생성 중',
  compact = false,
  bubbleColorClass = 'bg-transparent', // 배경색 투명으로 설정하여 기본적으로 메시지 말풍선과 동일한 배경을 가짐
  dotColorClass = 'bg-gray-700 dark:bg-gray-300', // 점 색상은 메시지 배경색과 대비되도록
  iconSize = 18,
}) => {
  const containerSpace = compact ? 'px-3 py-1.5 gap-1.5' : 'px-4 py-2 gap-2';
  const bubblePadding = compact ? 'p-0' : 'p-0'; // 배경 투명이므로 패딩 최소화
  const dotSize = compact ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const avatarSize = compact ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <div className={`flex items-end ${containerSpace}`}>
      {/* 봇 아바타 아이콘 */}
      <div
        className={`${avatarSize} flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md`}
        aria-hidden="true"
      >
        <BotIcon size={iconSize} ariaHidden />
      </div>

      {/* 로딩 점과 라벨 */}
      <div
        className={`${bubbleColorClass} rounded-xl rounded-bl-none ${bubblePadding} flex items-center`}
        role="status" // 스크린리더에 상태 변경을 알림
        aria-live="polite" // 스크린리더가 중요하게 알림
        aria-label={label} // 스크린리더를 위한 설명 텍스트
      >
        <DancingDots // 💡 DancingDots 컴포넌트 사용
          count={DOTS}
          dotClassName={`${dotSize} ${dotColorClass} rounded-full`}
        />
        <span className="sr-only">{label}</span> {/* 시각적으로는 숨기고 스크린리더만 읽음 */}
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;


// 💡 보조 컴포넌트: DancingDots (점 세 개 애니메이션) - 이 부분이 누락되면 에러 발생!
type DancingDotsProps = {
  count?: number; // 점의 개수
  dotClassName?: string; // 각 점에 적용될 CSS 클래스
  gapClassName?: string; // 점들 사이의 간격 클래스
};

const DancingDots: React.FC<DancingDotsProps> = ({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-700 rounded-full', // 기본 점 스타일 (상위 dotColorClass로 오버라이드)
  gapClassName = 'space-x-1.5',
}) => {
  // 모션 감소 환경(OS 설정)에서는 애니메이션을 제거합니다.
  const baseAnim = 'animate-pulse';
  const reducedMotion = 'motion-reduce:animate-none'; // Reduced Motion CSS

  return (
    <div className={`flex items-center ${gapClassName}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`${dotClassName} ${baseAnim} ${reducedMotion}`}
          style={{
            // Tailwind keyframes를 사용하는 것이 더 좋지만, 간단하게 CSS 변수로 애니메이션 지연을 줍니다.
            animationDelay: `${i * 0.18}s`, // 각 점마다 애니메이션 시작 시간을 다르게 설정하여 순차적인 움직임 연출
          }}
          aria-hidden="true" // 시각적 요소이므로 스크린리더에 숨김
        />
      ))}
    </div>
  );
};

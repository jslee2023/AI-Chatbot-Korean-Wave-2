// src/components/LoadingIndicator.tsx
import React from 'react';
import { BotIcon } from './IconComponents';

type LoadingIndicatorProps = {
  label?: string;          // 스크린 리더용 메시지 (예: "응답 생성 중")
  compact?: boolean;       // 여백/크기 축소 여부
  bubbleColorClass?: string; // 말풍선 배경색 클래스
  dotColorClass?: string;    // 점 색상 클래스
  iconSize?: number | string;
};

const DOTS = 3; // 점의 개수

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({
  label = '응답 생성 중',
  compact = false,
  bubbleColorClass = 'bg-gray-700/80 dark:bg-gray-300/80', // 반투명 배경 (두 번째 코드 채택, 다크 모드 추가)
  dotColorClass = 'bg-gray-300 dark:bg-gray-700', // 점 색상 대비 (두 번째 코드 채택, 다크 모드 추가)
  iconSize = 18,
}) => {
  const containerSpace = compact ? 'px-2 py-1 gap-1.5' : 'px-4 py-2 gap-2'; // 기본 간격 유지, compact 조정
  const bubblePadding = compact ? 'p-2' : 'p-3'; // 패딩 여유롭게 (두 번째 코드 p-3 채택, compact 축소)
  const dotSize = compact ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const avatarSize = compact ? 'w-7 h-7' : 'w-8 h-8';
  const dotGap = compact ? 'space-x-1' : 'space-x-1.5'; // 점 간격 (두 번째 코드 채택, compact 조정)

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
        role="status" // 스크린 리더에 상태 변경을 알림
        aria-live="polite" // 스크린 리더가 중요하게 알림
        aria-label={label} // 스크린 리더를 위한 설명 텍스트
      >
        <DancingDots // DancingDots 컴포넌트 사용
          count={DOTS}
          dotClassName={`${dotSize} ${dotColorClass} rounded-full`}
          gapClassName={dotGap}
        />
        <span className="sr-only">{label}</span> {/* 시각적으로는 숨기고 스크린 리더만 읽음 */}
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

// 💡 보조 컴포넌트: DancingDots (점 세 개 애니메이션)
type DancingDotsProps = {
  count?: number; // 점의 개수
  dotClassName?: string; // 각 점에 적용될 CSS 클래스
  gapClassName?: string; // 점들 사이의 간격 클래스
};

const DancingDots: React.FC<DancingDotsProps> = React.memo(({
  count = 3,
  dotClassName = 'w-2 h-2 bg-gray-300 rounded-full', // 기본 점 스타일 (상위 dotColorClass로 오버라이드)
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
            // Tailwind keyframes 대신 직접 animationDelay 사용 (두 번째 코드 채택, 더 정확한 제어)
            animationDelay: `${i * 0.2}s`, // 각 점마다 지연 시간 (두 번째 코드 0.2s 간격 채택)
          }}
          aria-hidden="true" // 시각적 요소이므로 스크린 리더에 숨김
        />
      ))}
    </div>
  );
});

export default LoadingIndicator;

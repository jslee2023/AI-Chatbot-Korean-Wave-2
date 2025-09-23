import React from 'react';

type IconProps = {
  title?: string;         // 스크린리더용 접근성 제목
  size?: number | string; // 아이콘 크기
  color?: string;         // stroke 색상
  strokeWidth?: number;   // 선 굵기
  className?: string;
  ariaHidden?: boolean;   // 장식용 여부
  role?: string;          // 필요 시 role 지정 (예: img)
};

const SvgBase: React.FC<React.PropsWithChildren<IconProps>> = ({
  title,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  className,
  ariaHidden,
  role,
  children,
}) => {
  const a11yProps =
    ariaHidden ?? !title
      ? { 'aria-hidden': true }
      : { role: role ?? 'img', 'aria-label': title };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11yProps}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
};

// 전송 아이콘
export const SendIcon: React.FC<IconProps> = React.memo((props) => (
  <SvgBase {...props}>
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </SvgBase>
));
SendIcon.displayName = 'SendIcon';

// 사용자 아이콘
export const UserIcon: React.FC<IconProps> = React.memo((props) => (
  <SvgBase {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgBase>
));
UserIcon.displayName = 'UserIcon';

// 봇 아이콘
export const BotIcon: React.FC<IconProps> = React.memo((props) => (
  <SvgBase {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="M12 5v.01" />
  </SvgBase>
));
BotIcon.displayName = 'BotIcon';

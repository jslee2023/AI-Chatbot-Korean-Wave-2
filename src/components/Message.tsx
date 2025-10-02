// src/components/Message.tsx (기존 코드에 아래 부분만 조정 – 전체는 이전 버전 유지)
import type { ChatMessage, Sender } from '../types'; // Sender import 확인

// 로딩용 더미 메시지 생성 헬퍼 (상위에서 사용)
export const createLoadingMessage = (): ChatMessage => ({
  id: `loading-${Date.now()}`, // 고유 ID
  sender: Sender.Bot,          // 봇으로 설정
  text: '',                    // 빈 텍스트 (로딩 시 DancingDots 표시)
});

// Message 컴포넌트 내부 (기존 if (loading) 블록을 message.text === '' && sender === Sender.Bot으로 변경)
const Message: React.FC<MessageProps> = React.memo(({ message }) => {
  if (!message) return null;

  const isUser = message.sender === Sender.User;
  const isBotLoading = message.sender === Sender.Bot && message.text === ''; // 빈 텍스트 봇 메시지 = 로딩

  if (isBotLoading) {
    // 로딩 시: 빈 봇 메시지 + DancingDots
    return (
      <div className="flex justify-start gap-2 mb-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md mr-2"
          aria-hidden="true"
        >
          <BotIcon size={18} ariaHidden />
        </div>
        <div className="max-w-[80%] md:max-w-lg p-3 rounded-xl shadow-md bg-gray-300/90 dark:bg-gray-700/90 self-start rounded-tl-none">
          <DancingDots />
        </div>
      </div>
    );
  }

  // 기존 일반 메시지 렌더링 (isUser 등) – 변경 없음
  const messageClasses = isUser
    ? 'bg-blue-500/80 self-end rounded-br-none'
    : 'bg-gray-300/90 dark:bg-gray-700/90 self-start rounded-tl-none';

  const containerClasses = `flex items-end ${isUser ? 'justify-end' : 'justify-start'} gap-2 mb-3`;

  const textContent = (
    <div
      className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap"
      dangerouslySetInnerHTML={formatText(message.text)}
    />
  );

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md mr-2"
          aria-hidden="true"
        >
          <BotIcon size={18} ariaHidden />
        </div>
      )}
      <div className={`max-w-[80%] md:max-w-lg p-3 rounded-xl shadow-md ${messageClasses}`}>
        {textContent}
      </div>
      {isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center ml-2 shadow-md"
          aria-hidden="true"
        >
          <UserIcon size={18} ariaHidden />
        </div>
      )}
    </div>
  );
});

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  FilmIcon, 
  MusicNoteIcon, 
  SparklesIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// 타입 정의
interface HeaderProps {
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  showControls?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

// 테마 토글 버튼 컴포넌트
const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${isDark 
          ? 'bg-white/10 hover:bg-white/20 text-white' 
          : 'bg-gray-200/80 hover:bg-gray-300 text-gray-700'
        }
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
      `}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <SparklesIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

// 드롭다운 메뉴 컴포넌트
const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onClearChat?: () => void;
  onNewChat?: () => void;
}> = ({ isOpen, onClose, onClearChat, onNewChat }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-50"
        >
          <div className="py-1">
            {onNewChat && (
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <SparklesIcon className="w-4 h-4 mr-3" />
                새 대화 시작
              </motion.button>
            )}
            {onClearChat && (
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClearChat();
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 mr-3" />
                대화 지우기
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 메인 헤더 컴포넌트
const Header: React.FC<HeaderProps> = ({
  onThemeToggle,
  isDarkMode = true,
  showControls = true,
  className = '',
  title = 'Hallyu AI Chatbot',
  subtitle = 'K-pop, 드라마, 영화 전문 AI',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 마운트 후 상태 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // 드롭다운 외부 클릭 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // ESC 키 핸들러
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);

  const handleNewChat = useCallback(() => {
    // 새 대화 시작 로직
    console.log('새 대화 시작');
  }, []);

  const handleClearChat = useCallback(() => {
    if (window.confirm('현재 대화 내용을 모두 지우시겠습니까?')) {
      // 대화 지우기 로직
      console.log('대화 지우기');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header 
      className={`
        p-4 border-b border-gray-700/50 bg-gradient-to-r 
        from-gray-800/80 via-gray-900/60 to-gray-800/80 
        backdrop-blur-xl rounded-t-2xl flex items-center justify-between 
        shadow-2xl shadow-gray-900/20 relative overflow-hidden
        ${className}
        dark:from-gray-800/95 dark:via-gray-900/80 dark:to-gray-800/95
      `}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* 로고 및 제목 */}
      <div className="flex items-center space-x-3 relative z-10">
        {/* 애니메이션 로고 아이콘 */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1.5">
            <div className="w-full h-full rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-6 h-6"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-purple-300">
                  <path d="M12 2L13.09 8.26L22 9L15.5 13.74L16.59 20L12 16.26L7.41 20L8.5 13.74L2 9L10.91 8.26L12 2Z" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 제목 */}
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-medium text-gray-300 dark:text-gray-400 leading-tight"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      {showControls && (
        <div className="flex items-center space-x-2 relative z-10">
          {/* 테마 토글 */}
          {onThemeToggle && (
            <ThemeToggle isDark={isDarkMode} onToggle={onThemeToggle} />
          )}

          {/* 드롭다운 메뉴 버튼 */}
          <motion.div 
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDropdown}
              className={`
                p-2 rounded-lg transition-all duration-200
                bg-white/10 hover:bg-white/20 text-white
                backdrop-blur-sm border border-white/20
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              `}
              aria-label="메뉴"
              aria-expanded={dropdownOpen}
            >
              <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <DropdownMenu
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              onNewChat={handleNewChat}
              onClearChat={handleClearChat}
            />
          </motion.div>
        </div>
      )}

      {/* 모바일 반응형 - 작은 화면에서는 제목만 표시 */}
      <style jsx>{`
        @media (max-width: 640px) {
          .mobile-hidden {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;

// 사용 예시 컴포넌트
const HeaderExample: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  const handleThemeToggle = () => {
    setIsDark(prev => !prev);
    // 실제 테마 전환 로직
    document.documentElement.classList.toggle('dark', !isDark);
  };

  const handleNewChat = () => {
    console.log('새 대화 시작');
    // 새 대화 로직
  };

  const handleClearChat = () => {
    if (window.confirm('대화를 지우시겠습니까?')) {
      console.log('대화 지우기');
      // 대화 초기화 로직
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Header
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDark}
        showControls={true}
        title="한류 마스터 AI"
        subtitle="K-문화 전문가"
        className="mx-4 mt-4"
      />
    </div>
  );
};

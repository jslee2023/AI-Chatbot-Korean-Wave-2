import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    // 💡 첫 번째 div: 전체 페이지의 배경, 글꼴, 가운데 정렬 등을 담당합니다.
    // 여기서는 배경 그라데이션을 유지하고, 챗봇 컨테이너를 중앙에 배치합니다.
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen text-white font-sans flex flex-col items-center justify-center p-4">
      {/*
        💡 두 번째 div: 챗봇 UI 전체를 감싸는 컨테이너입니다.
        이곳의 Tailwind 클래스들을 수정하여 챗봇 창의 배경, 투명도, 모서리, 그림자 등을 변경할 수 있습니다.
        아래 예시에서는 원래 코드와는 조금 다른 스타일을 적용해 보았습니다.
      */}
      <div
        className="
          w-full max-w-3xl h-[90vh]                   // 너비, 최대 너비, 높이 (원래와 동일)
          bg-gray-900 bg-opacity-80 backdrop-blur-md  // 👈 배경색을 더 어둡게, 불투명도를 높이고 블러 강도 조정 (수정 부분)
          rounded-xl shadow-lg                       // 👈 모서리 둥글기 'rounded-2xl' -> 'rounded-xl', 그림자 'shadow-2xl' -> 'shadow-lg' (수정 부분)
          flex flex-col
          border border-gray-600                     // 👈 테두리 색상 'border-gray-700' -> 'border-gray-600' (수정 부분)
        "
      >
        {/* 헤더 컴포넌트: 챗봇 상단 바 */}
        <Header />
        {/* ChatInterface 컴포넌트: 메시지 목록 및 입력창 등 챗봇 핵심 UI */}
        <ChatInterface />
      </div>

      {/* 푸터 영역 */}
      <footer className="text-center text-xs text-gray-400 mt-4">
        <p>Powered by Google Gemini. UI designed for an immersive Hallyu experience.</p>
      </footer>
    </div>
  );
};

export default App;

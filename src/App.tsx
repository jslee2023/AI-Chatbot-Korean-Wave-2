// src/App.tsx
import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    // 💡 전체 웹페이지의 배경 (그라데이션), 텍스트 색상, 폰트 등을 담당합니다.
    // min-h-screen으로 화면 전체 높이를 차지하며, flex/items-center/justify-center로 챗봇 창을 중앙에 배치합니다.
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen text-white font-sans flex flex-col items-center justify-center p-4">
      {/*
        💡 챗봇 창의 전체 형태, 크기, 색깔을 만드는 컨테이너
        <Header>와 <ChatInterface>를 모두 감싸며, App.tsx의 중앙 정렬의 영향을 받습니다.
      */}
      <div
        className="
          w-full max-w-3xl h-[90vh]                               // 크기: 너비, 최대 너비, 높이
          bg-gray-900 bg-opacity-80 backdrop-blur-md              // 배경색 및 투명도, 블러 효과
          rounded-xl shadow-lg                                   // 형태: 모서리 둥글기, 그림자
          flex flex-col                                          // 자식 요소(Header, ChatInterface)를 세로로 정렬
          border border-gray-600                                 // 테두리
          overflow-hidden                                        // 내용이 넘칠 경우 숨김 (내부에서 스크롤)
        "
      >
        <Header />         {/* 챗봇 헤더 컴포넌트 */}
        <ChatInterface />  {/* 챗봇의 핵심 UI (메시지 목록, 입력창 등) 컴포넌트 */}
      </div>

      {/* 하단 푸터 (간단한 정보 표시) */}
      <footer className="text-center text-xs text-gray-400 mt-4">
        <p>Powered by Google Gemini. UI designed for an immersive Hallyu experience.</p>
      </footer>
    </div>
  );
};

export default App;

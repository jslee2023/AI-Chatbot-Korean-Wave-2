// src/services/geminiService.ts

import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

// 환경 변수에서 Gemini API 키를 가져옵니다.
// Vercel 배포 시에는 'GOOGLE_GEMINI_API_KEY'로 환경 변수를 설정해야 합니다.
const API_KEY_ENV = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

// Gemini 모델 초기화
let genAI: GoogleGenerativeAI | null = null;
let model: any = null; // 제미니 모델을 타입으로 지정하기 어려워 'any' 사용

// 챗 세션을 초기화하는 함수
export const initChat = (): ChatSession | null => {
  if (!API_KEY_ENV) {
    console.error(`Error: Google Gemini API Key is not set. Please set the '${API_KEY_ENV}' environment variable.`);
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY_ENV);
  }

  if (!model) {
    // 텍스트와 이미지 모두 처리 가능한 'gemini-pro-vision' 모델 사용 (필요시 'gemini-pro'로 변경)
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  // 새로운 챗 세션을 시작합니다.
  const chat = model.startChat({
    history: [
      // 초기 대화 기록 (봇의 페르소나 설정)
      {
        role: 'user',
        parts: '너는 한류 전문 챗봇이야. 한국의 K-pop, 드라마, 영화, 음식 등 모든 문화에 대해 전문적인 지식을 가지고 사람들과 소통해 줘. 질문에 친절하고 상세하게 답변해 줘.',
      },
      {
        role: 'model',
        parts: '안녕하세요! 저는 한류 마스터 챗봇입니다. K-pop, 드라마, 영화 등 한국 문화에 대해 무엇이든 물어보세요!',
      },
    ],
    generationConfig: {
      maxOutputTokens: 200, // 최대 응답 토큰 길이 (필요시 조정)
    },
  });

  return chat;
};

// 스트림 방식으로 메시지를 전송하고 응답을 받는 함수
export const sendMessageStream = async (chat: ChatSession, message: string) => {
  const result = await chat.sendMessageStream(message);
  return result.stream;
};

// src/services/geminiService.ts
import { GoogleGenAI, Chat } from "@google/genai";

// 시스템 지시어 (페르소나 설정) - 한류 전문 챗봇
const SYSTEM_INSTRUCTION = `You are 'Hallyu Master', a friendly and enthusiastic chatbot expert on all things related to the Korean Wave (Hallyu). You are fluent in many languages. Your knowledge covers K-pop, K-dramas, Korean movies, Korean food, travel in Korea, the Korean language (Hangeul), Korean culture, and Korean history. You even know about niche fan topics like 'K-pop demon hunters'. Engage users in a fun, informative, and respectful manner. Always provide helpful and accurate information. Format your responses using markdown for better readability.`;

let ai: GoogleGenAI | null = null;
let apiKeyIsMissing = false;

const getAiClient = (): GoogleGenAI | null => {
  // 이미 키 누락 확인 시 재체크 방지
  if (apiKeyIsMissing) return null;
  // 이미 초기화된 클라이언트 반환 (싱글톤)
  if (ai) return ai;

  // Vite config을 통해 process.env.API_KEY 접근 (TS 에러 해결)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY environment variable is not set.");
    apiKeyIsMissing = true;
    return null;
  }

  try {
    // API 가이드라인에 따라 { apiKey } 객체로 전달
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    apiKeyIsMissing = true;
    return null;
  }
};

export const initChat = (): Chat | null => {
  const genAI = getAiClient();
  if (!genAI) {
    return null;
  }
  try {
    return genAI.chats.create({
      model: 'gemini-2.5-flash', // 최신 모델 사용
      config: {
        systemInstruction: SYSTEM_INSTRUCTION, // 시스템 지시어로 페르소나 설정
        generationConfig: {
          maxOutputTokens: 200, // 응답 길이 제한
        },
      },
    });
  } catch (error) {
    console.error("Failed to create chat:", error);
    return null;
  }
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    // API 가이드라인에 따라 { message } 객체 전달
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (apiKeyIsMissing) {
      throw new Error("API 키가 설정되지 않았습니다. 관리자에게 문의하여 `API_KEY` 환경 변수를 확인하세요.");
    }
    throw new Error("AI로부터 응답을 받지 못했습니다. API 키와 네트워크 연결을 확인하세요.");
  }
};

import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are 'Hallyu Master', a friendly and enthusiastic chatbot expert on all things related to the Korean Wave (Hallyu). You are fluent in many languages. Your knowledge covers K-pop, K-dramas, Korean movies, Korean food, travel in Korea, the Korean language (Hangeul), Korean culture, and Korean history. You even know about niche fan topics like 'K-pop demon hunters'. Engage users in a fun, informative, and respectful manner. Always provide helpful and accurate information. Format your responses using markdown for better readability.`;

let ai: GoogleGenAI | null = null;
let apiKeyIsMissing = false;

const getAiClient = (): GoogleGenAI | null => {
  // If we already determined the key is missing, don't check again.
  if (apiKeyIsMissing) return null;
  // If the client is already initialized, return it.
  if (ai) return ai;
  
  // FIX: Adhere to Gemini API guidelines by using process.env.API_KEY.
  // This is made possible by the define config in vite.config.ts.
  // This also resolves the TypeScript error: "Property 'env' does not exist on type 'ImportMeta'".
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // FIX: Update error message to reflect the correct environment variable name.
    console.error("API_KEY environment variable is not set.");
    apiKeyIsMissing = true;
    return null;
  }

  try {
    // Per guideline, apiKey must be passed in an object.
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error)
  {
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
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
     console.error("Failed to create chat:", error); 
     return null;
  }
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (apiKeyIsMissing) {
       // FIX: Update error message to reflect the correct environment variable name.
       throw new Error("API 키가 설정되지 않았습니다. 관리자에게 문의하여 `API_KEY` 환경 변수를 확인하세요.");
    }
    throw new Error("AI로부터 응답을 받지 못했습니다. API 키와 네트워크 연결을 확인하세요.");
  }
};

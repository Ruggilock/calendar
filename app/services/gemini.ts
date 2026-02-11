import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export const getSessionRecommendations = async (
  userQuery: string,
  scheduleData: string
) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a helpful conference assistant for TechConf 2024.
      User question: "${userQuery}"
      Current Agenda Data: ${scheduleData}

      Provide a concise answer suggesting specific sessions or explaining the schedule based on their interest. Be friendly and technical.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble accessing the schedule right now. Please try again in a moment.";
  }
};

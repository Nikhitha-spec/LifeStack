import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const decodeMedicalReport = async (reportContent: string, targetLanguage: string = "English") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
      You are LifeStack's clinical decoder. 
      Translate and explain the following medical information in plain, layperson terms that are accurate but easy to understand for a non-medical person.
      
      Target Language: ${targetLanguage}
      
      Medical Report/Content:
      "${reportContent}"
      
      Keep it empathetic and professional. Avoid overly complex jargon without explanation.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Decoding Error:", error);
        return "Error decoding medical report. Please consult your physician directly.";
    }
};

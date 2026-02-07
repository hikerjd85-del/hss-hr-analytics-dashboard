import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: In a real app, ensure process.env.API_KEY is set. 
// For this demo, we handle the case where it might be missing gracefully in the UI.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInsight = async (title: string, data: any[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment variables to use Gemini AI features.";
  }

  try {
    const dataString = JSON.stringify(data);
    const prompt = `
      You are an expert HR Data Analyst for Alberta Health Services.
      Analyze the following dataset for the metric: "${title}".
      
      Data: ${dataString}
      
      Please provide:
      1. A brief summary of the trend.
      2. Two key observations or anomalies.
      3. A recommended action item for management.
      
      Keep the tone professional and concise. Format with clear headers or bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis could be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing the data. Please try again later.";
  }
};

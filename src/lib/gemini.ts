import { GoogleGenAI } from "@google/genai";
import { LogEntry } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function analyzeLogs(logs: LogEntry[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const logContent = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`).join('\n');
  
  const prompt = `
    You are a Senior Site Reliability Engineer (SRE). 
    Analyze the following system logs and provide a concise summary of the system health.
    Identify any critical issues and suggest immediate remediation steps.
    
    LOGS:
    ${logContent}
    
    Provide a professional, technical summary in Markdown format.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Unable to analyze logs at this time.";
  } catch (error) {
    console.error("Error analyzing logs:", error);
    return error instanceof Error ? error.message : "Error during log analysis.";
  }
}

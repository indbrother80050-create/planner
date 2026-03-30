import { GoogleGenAI, Type } from "@google/genai";
import { Todo, Suggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPlannerSuggestions(todos: Todo[]): Promise<Suggestion[]> {
  const model = "gemini-3-flash-preview";
  
  const todoList = todos.map(t => `- [${t.completed ? 'x' : ' '}] ${t.text} (${t.category})`).join('\n');
  
  const prompt = `
    I have the following todo list:
    ${todoList || "No tasks yet."}
    
    Based on these tasks, suggest 3-4 new tasks or improvements to my day. 
    Focus on a "natural feel" - balance work with personal well-being, health, and mindfulness.
    If I have too many work tasks, suggest a break or a health-related task.
    If I have no tasks, suggest some starting points for a productive yet balanced day.
    
    Return the suggestions in a JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              reason: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                enum: ['work', 'personal', 'health', 'other']
              }
            },
            required: ["title", "description", "reason", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return [];
  }
}

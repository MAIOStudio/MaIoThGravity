import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
}

export const getCompletion = async (messages: ChatMessage[], tools?: any[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      tools: tools,
      tool_choice: tools ? 'auto' : undefined,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error('Groq Error:', error);
    // Fallback logic could go here
    throw error;
  }
};

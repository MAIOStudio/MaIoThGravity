import { getCompletion, ChatMessage } from '../llm/llm.service.js';
import { tools, executeTool } from './tools.js';
import { saveMessage, getHistory } from '../database/database.js';

const MAX_ITERATIONS = 5;

export const runAgent = async (userId: string, userMessage: string): Promise<string> => {
  // Save user message
  await saveMessage(userId, 'user', userMessage);

  // Get history
  let history = await getHistory(userId);
  let messages: ChatMessage[] = (history || []).map(m => ({ role: m.role, content: m.content }));

  // Add system prompt if empty
  if (messages.length === 0 || messages[0].role !== 'system') {
    messages.unshift({
      role: 'system',
      content: 'You are MaIoThGravity, a personal AI assistant. You are helpful, concise and secure.'
    });
  }

  let iterations = 0;
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await getCompletion(messages, tools);

    if (!response.tool_calls) {
      const content = response.content || 'I encountered an error.';
      await saveMessage(userId, 'assistant', content);
      return content;
    }

    // Handle tool calls
    messages.push(response as any);
    for (const toolCall of response.tool_calls) {
      console.log(`Executing tool: ${toolCall.function.name}`);
      const result = await executeTool(toolCall.function.name, JSON.parse(toolCall.function.arguments));
      
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: result,
      });
      
      await saveMessage(userId, 'tool', `Tool ${toolCall.function.name} result: ${result}`);
    }
  }

  return "I've reached my maximum reasoning limit for this request.";
};

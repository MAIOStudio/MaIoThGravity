import { z } from 'zod';

export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current local time.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

export const executeTool = async (name: string, args: any) => {
  if (name === 'get_current_time') {
    return new Date().toLocaleString();
  }
  throw new Error(`Tool ${name} not found`);
};

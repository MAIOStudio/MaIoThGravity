import { Bot } from 'grammy';
import dotenv from 'dotenv';
import { runAgent } from '../agent/agent.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedUserIds = (process.env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(id => id.trim());

if (!token) throw new Error('TELEGRAM_BOT_TOKEN is required');

export const bot = new Bot(token);

// Safety Middleware: Whitelist
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id.toString();
  if (userId && allowedUserIds.includes(userId)) {
    return await next();
  }
  console.log(`Unauthorized access attempt from ID: ${userId}`);
  if (ctx.chat?.type === 'private') {
    await ctx.reply('No estás autorizado para usar este agente.');
  }
});

bot.command('start', async (ctx) => {
  await ctx.reply('Hola! Soy MaIoThGravity, tu agente personal. ¿En qué puedo ayudarte hoy?');
});

bot.on('message:text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;

  await ctx.replyWithChatAction('typing');
  
  try {
    const response = await runAgent(userId, text);
    await ctx.reply(response);
  } catch (error) {
    console.error('Agent Error:', error);
    await ctx.reply('Lo siento, ocurrió un error al procesar tu solicitud.');
  }
});

console.log('Bot configuration loaded.');

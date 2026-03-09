import { bot } from './bot/bot.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('MaIoThGravity is alive! 🚀'));
app.get('/health', (req, res) => res.status(200).send('OK'));

async function startBot() {
  console.log('--- Iniciando MaIoThGravity ---');
  
  // Servidor para Render/Cloud
  app.listen(port, () => {
    console.log(`Health check server listening on port ${port}`);
  });

  // Inicio del bot (Long Polling por defecto para simplicidad en Render)
  bot.start({
    onStart: (botInfo) => {
      console.log(`Bot @${botInfo.username} funcionando.`);
    }
  }).catch(err => {
    console.error('Error en el bot:', err);
  });

  // Manejo de apagado
  process.once('SIGINT', () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
}

startBot().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

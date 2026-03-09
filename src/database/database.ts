import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

dotenv.config();

// Service Account Path
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const absolutePath = join(process.cwd(), serviceAccountPath);
const configEnv = process.env.FIREBASE_CONFIG_JSON;

if (configEnv) {
  // Caso 1: Configuración en variable de entorno (Ideal para Cloud/Render)
  try {
    const serviceAccount = JSON.parse(configEnv);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[FIREBASE] Initialized via FIREBASE_CONFIG_JSON.');
  } catch (error) {
    console.error('[FIREBASE] Error parsing FIREBASE_CONFIG_JSON:', error);
  }
} else if (existsSync(absolutePath)) {
  // Caso 2: Archivo local (Uso en PC)
  try {
    const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[FIREBASE] Initialized with service-account.json.');
  } catch (error) {
    console.error('[FIREBASE] JSON initialization error:', error);
  }
} else {
  // Caso 3: Sin credenciales (Error o Cloud Default)
  try {
    admin.initializeApp();
    console.log('[FIREBASE] Initialized with default credentials.');
  } catch (error) {
    console.error('[FIREBASE] Failed all initialization methods:', error);
  }
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

export const saveMessage = async (userId: string, role: string, content: string) => {
  if (!db) {
    console.warn('[FIREBASE] Database not initialized. Message not saved.');
    return;
  }

  try {
    const messagesRef = db.collection('conversations').doc(userId).collection('messages');
    await messagesRef.add({
      role,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('[FIREBASE] Error saving message:', error);
  }
};

export const getHistory = async (userId: string, limit: number = 20): Promise<Message[]> => {
  if (!db) {
    console.warn('[FIREBASE] Database not initialized. Returning empty history.');
    return [];
  }

  try {
    const messagesRef = db.collection('conversations').doc(userId).collection('messages');
    const snapshot = await messagesRef.orderBy('timestamp', 'desc').limit(limit).get();
    
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        role: data.role as 'user' | 'assistant' | 'system' | 'tool',
        content: data.content
      };
    });
    
    return messages.reverse();
  } catch (error) {
    console.error('[FIREBASE] Error fetching history:', error);
    return [];
  }
};

export default db;

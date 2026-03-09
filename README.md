# MaIoThGravity 🌌

**MaIoThGravity** es un agente de Inteligencia Artificial personal, diseñado para funcionar tanto de forma local como en la nube, utilizando **Telegram** como su única interfaz de usuario. Este proyecto prioriza la simplicidad, la seguridad y el control total sobre los datos.

## ✨ Características Principales

- **Interfaz de Telegram**: Comunicación fluida a través de un bot privado.
- **Razonamiento con LLM**: Utiliza el modelo **Llama 3.3 70B** a través de la API de **Groq** para un pensamiento rápido y preciso.
- **Memoria Persistente Híbrida**: 
  - **Local**: Almacenamiento opcional en SQLite.
  - **Nube**: Sincronización completa con **Firebase Firestore**.
- **Agent Loop**: Ciclo de razonamiento (Thought -> Action -> Observation) con límite de iteraciones para mayor seguridad.
- **Seguridad por Whitelist**: Solo los IDs de usuario de Telegram autorizados pueden interactuar con el agente.
- **Arquitectura Modular**: Fácil de escalar con nuevas herramientas (tools) y canales.
- **Multi-Entorno**: Compatible con ejecución local (Long Polling) y despliegue en la nube como Render o Firebase (Webhooks/Docker).

## 🛠️ Stack Tecnológico

- **Lenguaje**: TypeScript (ES Modules)
- **Telegram Framework**: [grammY](https://grammy.dev/)
- **LLM Provider**: [Groq API](https://groq.com/)
- **Base de Datos**: Firebase Firestore (Cloud) / SQLite (Local)
- **Runtime**: Node.js con `tsx` para desarrollo.
- **Despliegue**: Docker compatible con Render.com.

## 🚀 Configuración Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/MAIOStudio/MaIoThGravity.git
   cd MaIoThGravity
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el entorno**:
   Crea un archivo `.env` en la raíz basado en `.env.example`:
   ```env
   TELEGRAM_BOT_TOKEN="tu_token_de_botfather"
   TELEGRAM_ALLOWED_USER_IDS="tu_id_digital"
   GROQ_API_KEY="tu_clave_de_groq"
   OPENROUTER_API_KEY="opcional"
   DB_PATH="./memory.db"
   GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
   ```

4. **Credenciales de Firebase**:
   Coloca tu archivo `service-account.json` en la raíz del proyecto para habilitar la persistencia en la nube.

5. **Ejecutar**:
   ```bash
   npm run dev
   ```

## ☁️ Despliegue en Render.com (Gratis)

Este proyecto está listo para ser desplegado en Render usando **Docker**, lo que evita la necesidad de tarjetas de crédito.

1. Conecta tu repositorio de GitHub a Render.
2. Crea un **Web Service**.
3. Selecciona el **Runtime: Docker**.
4. En **Environment Variables**, añade:
   - Todas las variables de tu `.env`.
   - `FIREBASE_CONFIG_JSON`: El contenido completo de tu archivo `service-account.json`.
5. Render detectará el `Dockerfile` y desplegará el agente automáticamente.

## 🛡️ Seguridad

- **Acceso Restringido**: El bot ignora cualquier mensaje que no provenga de los IDs configurados en `TELEGRAM_ALLOWED_USER_IDS`.
- **Secretos**: No subas archivos `.env` ni `service-account.json` al repositorio (están incluidos en `.gitignore`).

## 📈 Próximas Iteraciones (Roadmap)

- [ ] Integración de herramientas de transcripción de audio.
- [ ] Conectividad con Texto-a-Voz (ElevenLabs).
- [ ] Ampliación de la "caja de herramientas" (Google Search, Python Executor).
- [ ] Interfaz web de administración.

---
Creado por el equipo de **MAIOStudio**.

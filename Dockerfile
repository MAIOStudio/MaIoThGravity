# Usar una imagen base de Node.js
FROM node:20-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto que Render usará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

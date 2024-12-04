FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências do backend (do package.json)
COPY backend/package*.json ./backend/

# Instala as dependências do backend
RUN npm install --prefix ./backend

# Copia o código do backend para dentro do container
COPY ./backend ./backend

# Copia os arquivos estáticos do frontend
COPY ./frontend/public ./frontend/public

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start", "--prefix", "backend"]

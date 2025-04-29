# dockerfile (na raiz)
# Etapa 1: Build do frontend
FROM node:18 as frontend
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Etapa 2: Backend
FROM python:3.11
WORKDIR /app

# Copia o backend e os arquivos do build do frontend
COPY backend ./backend
COPY --from=frontend /app/frontend/build ./backend/static

# Instala dependências do backend
RUN pip install --no-cache-dir -r backend/requirements.txt

# Exponha a porta única
EXPOSE 8000

# Rodando FastAPI com Uvicorn
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

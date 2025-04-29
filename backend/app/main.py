from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve a build do React
app.mount("/", StaticFiles(directory="backend/static", html=True), name="static")

# Ou servir index.html para rotas não encontradas
@app.get("/{full_path:path}")
async def serve_react_app():
    return FileResponse("backend/static/index.html")

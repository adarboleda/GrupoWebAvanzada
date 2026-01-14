# archivo: main.py
from fastapi import FastAPI

from pydantic import BaseModel

app = FastAPI()

# Endpoint GET básico
@app.get("/")
async def read_root():
    return {"message": "¡Bienvenido a FastAPI!"}

# Modelo para datos de ejemplo
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

# Endpoint POST para crear un item
@app.post("/items/")
async def create_item(item: Item):
    return {"item": item}

# Endpoint GET con parámetro
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

# Endpoint PUT para actualizar un item
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "updated_item": item}

# Endpoint DELETE para eliminar un item
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"item_id": item_id, "deleted": True}

# Ejecutar desde la terminal (en la carpeta del proyecto):
# uvicorn main:app --reload

# Luego abre en el navegador:
# http://127.0.0.1:8000
# Documentación interactiva:
# http://127.0.0.1:8000/docs
# o Redoc:
# http://127.0.0.1:8000/redoc
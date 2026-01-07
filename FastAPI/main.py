from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# Configuración
app = FastAPI(
    title="API Tutorial FastAPI",
    description="API con configuración y múltiples endpoints",
    version="1.0.0"
)

# Modelos Pydantic
class Usuario(BaseModel):
    id: Optional[int] = None
    nombre: str
    email: str
    edad: int

class Producto(BaseModel):
    id: Optional[int] = None
    nombre: str
    precio: float
    cantidad: int

# Base de datos simulada
usuarios_db = [
    {"id": 1, "nombre": "Juan", "email": "juan@example.com", "edad": 25},
    {"id": 2, "nombre": "Maria", "email": "maria@example.com", "edad": 30}
]

productos_db = [
    {"id": 1, "nombre": "Laptop", "precio": 999.99, "cantidad": 5},
    {"id": 2, "nombre": "Mouse", "precio": 19.99, "cantidad": 50}
]

# Rutas básicas
@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API", "version": "1.0.0"}

@app.get("/saludo/{nombre}")
def saludo(nombre: str):
    return {"saludo": f"Hola {nombre}"}

@app.get("/suma/{a}/{b}")
def suma(a: int, b: int):
    return {"resultado": a + b}

# ENDPOINTS DE USUARIOS
@app.get("/usuarios")
def obtener_usuarios():
    return {"usuarios": usuarios_db}

@app.get("/usuarios/{usuario_id}")
def obtener_usuario(usuario_id: int):
    for usuario in usuarios_db:
        if usuario["id"] == usuario_id:
            return usuario
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@app.post("/usuarios")
def crear_usuario(usuario: Usuario):
    nuevo_id = max([u["id"] for u in usuarios_db]) + 1 if usuarios_db else 1
    nuevo_usuario = {
        "id": nuevo_id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "edad": usuario.edad
    }
    usuarios_db.append(nuevo_usuario)
    return {"mensaje": "Usuario creado", "usuario": nuevo_usuario}

@app.put("/usuarios/{usuario_id}")
def actualizar_usuario(usuario_id: int, usuario: Usuario):
    for i, u in enumerate(usuarios_db):
        if u["id"] == usuario_id:
            usuarios_db[i] = {
                "id": usuario_id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "edad": usuario.edad
            }
            return {"mensaje": "Usuario actualizado", "usuario": usuarios_db[i]}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@app.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int):
    for i, u in enumerate(usuarios_db):
        if u["id"] == usuario_id:
            usuario_eliminado = usuarios_db.pop(i)
            return {"mensaje": "Usuario eliminado", "usuario": usuario_eliminado}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

# ENDPOINTS DE PRODUCTOS
@app.get("/productos")
def obtener_productos():
    return {"productos": productos_db}

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    for producto in productos_db:
        if producto["id"] == producto_id:
            return producto
    raise HTTPException(status_code=404, detail="Producto no encontrado")

@app.post("/productos")
def crear_producto(producto: Producto):
    nuevo_id = max([p["id"] for p in productos_db]) + 1 if productos_db else 1
    nuevo_producto = {
        "id": nuevo_id,
        "nombre": producto.nombre,
        "precio": producto.precio,
        "cantidad": producto.cantidad
    }
    productos_db.append(nuevo_producto)
    return {"mensaje": "Producto creado", "producto": nuevo_producto}

@app.put("/productos/{producto_id}")
def actualizar_producto(producto_id: int, producto: Producto):
    for i, p in enumerate(productos_db):
        if p["id"] == producto_id:
            productos_db[i] = {
                "id": producto_id,
                "nombre": producto.nombre,
                "precio": producto.precio,
                "cantidad": producto.cantidad
            }
            return {"mensaje": "Producto actualizado", "producto": productos_db[i]}
    raise HTTPException(status_code=404, detail="Producto no encontrado")

@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int):
    for i, p in enumerate(productos_db):
        if p["id"] == producto_id:
            producto_eliminado = productos_db.pop(i)
            return {"mensaje": "Producto eliminado", "producto": producto_eliminado}
    raise HTTPException(status_code=404, detail="Producto no encontrado")

# ENDPOINT ADICIONAL - Búsqueda
@app.get("/usuarios/buscar/por-nombre/{nombre}")
def buscar_usuario_por_nombre(nombre: str):
    resultados = [u for u in usuarios_db if nombre.lower() in u["nombre"].lower()]
    if resultados:
        return {"resultados": resultados}
    raise HTTPException(status_code=404, detail="No se encontraron usuarios")

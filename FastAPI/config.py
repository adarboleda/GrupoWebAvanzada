from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Configuración de la aplicación FastAPI"""
    
    # Información de la API
    api_title: str = "API Tutorial FastAPI"
    api_version: str = "1.0.0"
    api_description: str = "API completa con usuarios y productos"
    
    # Servidor
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = True
    
    # Base de datos (para futuro)
    database_url: Optional[str] = None
    
    # CORS
    cors_origins: list = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list = ["*"]
    cors_allow_headers: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

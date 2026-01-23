from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, computed_field
from typing import List, Any, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """Configuration de l'application"""
    # Trouver le fichier .env dans le dossier backApi même si on lance depuis la racine
    _env_file = Path(__file__).parent / ".env"
    
    model_config = SettingsConfigDict(
        env_file=str(_env_file) if _env_file.exists() else ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        env_parse_none_str="",
    )
    
    gemini_api_key: Optional[str] = None
    host: str = "0.0.0.0"
    # Railway fournit le PORT via variable d'environnement, sinon utiliser 8000
    port: int = 8000
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Vérifier que la clé API est fournie
        if not self.gemini_api_key or self.gemini_api_key == "" or self.gemini_api_key == "your_gemini_api_key_here":
            raise ValueError(
                "GEMINI_API_KEY est requise !\n"
                "Créez un fichier .env dans le dossier backApi/ avec :\n"
                "GEMINI_API_KEY=votre_cle_api_gemini\n\n"
                "Obtenez votre clé sur: https://makersuite.google.com/app/apikey"
            )
        # Surcharger le port avec la variable d'environnement PORT si elle existe (pour Railway)
        railway_port = os.getenv("PORT")
        if railway_port:
            self.port = int(railway_port)
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v: Any) -> str:
        """Parse la valeur en chaîne"""
        if isinstance(v, list):
            return ','.join(v)
        if isinstance(v, str):
            return v
        return "http://localhost:3000,http://localhost:5173"
    
    @computed_field
    @property
    def cors_origins_list(self) -> List[str]:
        """Retourne cors_origins comme liste"""
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


settings = Settings()

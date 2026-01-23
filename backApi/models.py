from pydantic import BaseModel, Field
from typing import Optional, List


class ChatMessage(BaseModel):
    """Modèle pour un message de chat"""
    role: str = Field(..., description="Rôle du message: 'user' ou 'assistant'")
    content: str = Field(..., min_length=1, description="Contenu du message")


class ChatRequest(BaseModel):
    """Modèle pour une requête de chat"""
    message: str = Field(..., min_length=1, max_length=10000, description="Message de l'utilisateur")
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=None,
        description="Historique de la conversation (optionnel)"
    )
    temperature: Optional[float] = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Température pour la génération (0.0 à 2.0)"
    )
    max_tokens: Optional[int] = Field(
        default=1000,
        ge=1,
        le=8192,
        description="Nombre maximum de tokens à générer"
    )


class ChatResponse(BaseModel):
    """Modèle pour une réponse de chat"""
    response: str = Field(..., description="Réponse du chatbot")
    success: bool = Field(..., description="Indique si la requête a réussi")
    error: Optional[str] = Field(default=None, description="Message d'erreur si échec")


class HealthResponse(BaseModel):
    """Modèle pour la réponse de santé de l'API"""
    status: str
    message: str

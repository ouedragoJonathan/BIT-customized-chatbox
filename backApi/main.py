from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models import ChatRequest, ChatResponse, HealthResponse
from gemini_service import GeminiService
from config import settings

# Instance globale du service Gemini
gemini_service: GeminiService = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    # Démarrage
    global gemini_service
    gemini_service = GeminiService()
    yield
    # Arrêt (nettoyage si nécessaire)
    gemini_service = None


# Création de l'application FastAPI
app = FastAPI(
    title="Chatbot API avec Gemini",
    description="API backend pour un chatbot utilisant Google Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
async def root():
    """Endpoint racine pour vérifier que l'API fonctionne"""
    return HealthResponse(
        status="ok",
        message="API Chatbot Gemini est opérationnelle"
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Endpoint de santé pour vérifier l'état de l'API"""
    return HealthResponse(
        status="healthy",
        message="Service disponible"
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal pour envoyer un message au chatbot
    
    Valide la requête et communique avec Gemini pour obtenir une réponse
    """
    try:
        # Vérification que le service est initialisé
        if gemini_service is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service Gemini non initialisé"
            )
        
        # Validation du message
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le message ne peut pas être vide"
            )
        
        # Validation de l'historique si fourni
        if request.conversation_history:
            for msg in request.conversation_history:
                if msg.role not in ['user', 'assistant']:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Rôle invalide: {msg.role}. Doit être 'user' ou 'assistant'"
                    )
        
        # Envoi du message à Gemini
        response_text = await gemini_service.chat(
            message=request.message,
            conversation_history=request.conversation_history,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        if not response_text:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Réponse vide reçue de Gemini"
            )
        
        return ChatResponse(
            response=response_text,
            success=True,
            error=None
        )
        
    except HTTPException:
        # Re-lancer les HTTPException telles quelles
        raise
    except ValueError as e:
        # Erreur de validation
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur de validation: {str(e)}"
        )
    except Exception as e:
        # Autres erreurs
        error_message = str(e)
        # Déterminer le code d'erreur approprié
        if "API_KEY" in error_message or "api key" in error_message.lower():
            status_code = status.HTTP_401_UNAUTHORIZED
        elif "quota" in error_message.lower() or "rate limit" in error_message.lower():
            status_code = status.HTTP_429_TOO_MANY_REQUESTS
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        
        raise HTTPException(
            status_code=status_code,
            detail=error_message
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )

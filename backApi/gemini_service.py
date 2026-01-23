import google.generativeai as genai
from typing import List, Optional
from models import ChatMessage
from config import settings
import asyncio


class GeminiService:
    """Service pour interagir avec l'API Google Gemini"""
    
    def __init__(self):
        """Initialise le service Gemini avec la clé API"""
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY n'est pas définie dans les variables d'environnement")
        
        genai.configure(api_key=settings.gemini_api_key)
        # Utiliser gemini-1.5-flash ou gemini-pro selon disponibilité
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        except Exception:
            # Fallback sur gemini-pro si gemini-1.5-flash n'est pas disponible
            self.model = genai.GenerativeModel('gemini-pro')
    
    def format_history(self, history: Optional[List[ChatMessage]]) -> List[dict]:
        """Formate l'historique de conversation pour Gemini"""
        if not history:
            return []
        
        formatted = []
        for msg in history:
            # Gemini utilise 'user' et 'model' au lieu de 'assistant'
            role = 'user' if msg.role == 'user' else 'model'
            formatted.append({
                'role': role,
                'parts': [{'text': msg.content}]
            })
        return formatted
    
    async def chat(
        self,
        message: str,
        conversation_history: Optional[List[ChatMessage]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        Envoie un message à Gemini et retourne la réponse
        
        Args:
            message: Message de l'utilisateur
            conversation_history: Historique de la conversation
            temperature: Température pour la génération
            max_tokens: Nombre maximum de tokens
            
        Returns:
            Réponse du modèle Gemini
        """
        try:
            # Configuration de la génération
            generation_config = {
                'temperature': temperature,
                'max_output_tokens': max_tokens,
            }
            
            # Si on a un historique, on l'utilise
            if conversation_history and len(conversation_history) > 0:
                formatted_history = self.format_history(conversation_history)
                # Créer une conversation avec historique
                chat = self.model.start_chat(history=formatted_history)
                # Exécuter de manière asynchrone dans un thread séparé
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: chat.send_message(message, generation_config=generation_config)
                )
            else:
                # Conversation simple sans historique
                # Exécuter de manière asynchrone dans un thread séparé
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: self.model.generate_content(
                        message,
                        generation_config=generation_config
                    )
                )
            
            # Extraire le texte de la réponse
            if hasattr(response, 'text'):
                return response.text
            elif hasattr(response, 'candidates') and len(response.candidates) > 0:
                return response.candidates[0].content.parts[0].text
            else:
                raise Exception("Format de réponse inattendu de Gemini")
            
        except genai.types.BlockedPromptException as e:
            raise Exception(f"Le contenu a été bloqué par les filtres de sécurité Gemini: {str(e)}")
        except genai.types.StopCandidateException as e:
            raise Exception(f"La génération a été arrêtée: {str(e)}")
        except Exception as e:
            error_msg = str(e)
            if "API_KEY" in error_msg or "api key" in error_msg.lower():
                raise Exception("Clé API Gemini invalide ou manquante")
            elif "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
                raise Exception("Quota API dépassé ou limite de taux atteinte")
            else:
                raise Exception(f"Erreur lors de la communication avec Gemini: {error_msg}")

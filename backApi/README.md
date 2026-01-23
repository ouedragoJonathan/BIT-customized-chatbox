# Backend Chatbot avec FastAPI et Gemini

API backend complète pour un chatbot utilisant Google Gemini, construite avec FastAPI.

## Fonctionnalités

- ✅ API REST avec FastAPI
- ✅ Intégration avec Google Gemini
- ✅ Validation des requêtes avec Pydantic
- ✅ Support de l'historique de conversation
- ✅ Configuration via variables d'environnement
- ✅ CORS configuré
- ✅ Gestion d'erreurs complète

## Installation

### 1. Créer un environnement virtuel

```bash
python -m venv venv
```

### 2. Activer l'environnement virtuel

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configuration

Créer un fichier `.env` à la racine du dossier `backApi` (vous pouvez copier `env.example` comme modèle) :

```env
GEMINI_API_KEY=votre_cle_api_gemini
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

**Obtenir une clé API Gemini:**
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une nouvelle clé API
3. Copier la clé dans votre fichier `.env`

**Important:** Le fichier `.env` doit être dans le dossier `backApi/` et non à la racine du projet.

## Utilisation

### Démarrer le serveur

```bash
python main.py
```

Ou avec uvicorn directement :

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur `http://localhost:8000`

### Documentation API

Une fois le serveur démarré, accédez à :
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Endpoints

### `GET /`
Vérifie que l'API fonctionne.

**Réponse:**
```json
{
  "status": "ok",
  "message": "API Chatbot Gemini est opérationnelle"
}
```

### `GET /health`
Vérifie l'état de santé de l'API.

### `POST /chat`
Envoie un message au chatbot.

**Corps de la requête:**
```json
{
  "message": "Bonjour, comment ça va ?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Salut"
    },
    {
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider ?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Paramètres:**
- `message` (requis): Le message de l'utilisateur
- `conversation_history` (optionnel): Historique de la conversation
- `temperature` (optionnel, défaut: 0.7): Température pour la génération (0.0 à 2.0)
- `max_tokens` (optionnel, défaut: 1000): Nombre maximum de tokens à générer

**Réponse:**
```json
{
  "response": "Bonjour ! Je vais très bien, merci de demander. Comment puis-je vous aider aujourd'hui ?",
  "success": true,
  "error": null
}
```

## Exemple d'utilisation avec curl

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explique-moi ce qu'est l'intelligence artificielle",
    "temperature": 0.7
  }'
```

## Structure du projet

```
backApi/
├── main.py              # Application FastAPI principale
├── models.py            # Modèles Pydantic pour validation
├── gemini_service.py    # Service d'intégration avec Gemini
├── config.py            # Configuration de l'application
├── requirements.txt     # Dépendances Python
├── .env                 # Variables d'environnement (à créer)
└── README.md           # Documentation
```

## Notes

- Assurez-vous d'avoir une clé API Gemini valide
- La température contrôle la créativité des réponses (plus élevée = plus créatif)
- L'historique de conversation permet de maintenir le contexte

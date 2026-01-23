# Guide de Démarrage Rapide - Chatbot BIT avec Gemini

Ce guide vous explique comment configurer et lancer le chatbot BIT avec le backend FastAPI et l'intégration Gemini.

## 📋 Prérequis

- Python 3.8 ou supérieur
- Node.js 16 ou supérieur
- Une clé API Google Gemini (gratuite)

## 🚀 Installation et Configuration

### 1. Configuration du Backend

#### a. Aller dans le dossier backend
```bash
cd backApi
```

#### b. Créer un environnement virtuel Python
```bash
python -m venv venv
```

#### c. Activer l'environnement virtuel

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### d. Installer les dépendances
```bash
pip install -r requirements.txt
```

#### e. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backApi/` (copiez `env.example` comme modèle) :

```env
GEMINI_API_KEY=votre_cle_api_gemini_ici
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

**Obtenir une clé API Gemini:**
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Copiez la clé dans votre fichier `.env`

### 2. Configuration du Frontend

#### a. Aller dans le dossier frontend
```bash
cd front_bit_ai
```

#### b. Installer les dépendances
```bash
npm install
```

#### c. Configurer l'URL de l'API (optionnel)

Créez un fichier `.env.local` dans le dossier `front_bit_ai/` :

```env
VITE_API_URL=http://localhost:8000
```

Par défaut, le frontend utilise `http://localhost:8000` si cette variable n'est pas définie.

## ▶️ Lancement de l'Application

### 1. Démarrer le Backend

Dans le dossier `backApi/`, avec l'environnement virtuel activé :

```bash
python main.py
```

Ou avec uvicorn directement :
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur backend sera accessible sur `http://localhost:8000`

**Vérification:** Ouvrez `http://localhost:8000/docs` pour voir la documentation Swagger de l'API.

### 2. Démarrer le Frontend

Dans un **nouveau terminal**, allez dans le dossier `front_bit_ai/` :

```bash
cd front_bit_ai
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173` (ou un autre port si 5173 est occupé).

## ✅ Vérification

1. **Backend:** Ouvrez `http://localhost:8000/health` dans votre navigateur. Vous devriez voir :
   ```json
   {
     "status": "healthy",
     "message": "Service disponible"
   }
   ```

2. **Frontend:** Ouvrez `http://localhost:5173` dans votre navigateur. Vous devriez voir l'interface du chatbot.

3. **Test:** Envoyez un message dans le chatbot. Il devrait communiquer avec Gemini via le backend.

## 🔧 Dépannage

### Le backend ne démarre pas
- Vérifiez que la clé API Gemini est correctement configurée dans `.env`
- Vérifiez que le port 8000 n'est pas déjà utilisé
- Vérifiez que toutes les dépendances sont installées : `pip install -r requirements.txt`

### Le frontend ne peut pas se connecter au backend
- Vérifiez que le backend est bien démarré
- Vérifiez l'URL dans `front_bit_ai/src/services/api.js` ou dans `.env.local`
- Vérifiez les CORS dans `backApi/config.py` - l'URL du frontend doit être dans `CORS_ORIGINS`

### Erreur "Clé API invalide"
- Vérifiez que votre clé API Gemini est valide
- Assurez-vous que le fichier `.env` est dans le dossier `backApi/`
- Redémarrez le serveur backend après avoir modifié `.env`

## 📚 Documentation API

Une fois le backend démarré, accédez à :
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🎯 Endpoints Principaux

- `GET /health` - Vérifie l'état de santé de l'API
- `POST /chat` - Envoie un message au chatbot et reçoit une réponse de Gemini

## 📝 Notes

- Le backend utilise `gemini-1.5-flash` par défaut (plus rapide) avec fallback sur `gemini-pro`
- L'historique de conversation est maintenu pour un contexte cohérent
- Les réponses sont générées avec une température de 0.7 par défaut (ajustable)

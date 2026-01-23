# Guide de Déploiement sur Railway

Ce guide vous explique comment déployer votre API FastAPI sur Railway.

## 📋 Prérequis

- Un compte Railway (gratuit sur [railway.app](https://railway.app))
- Un compte GitHub (pour connecter votre repository)
- Une clé API Gemini

## 🚀 Étapes de Déploiement

### 1. Préparer votre Repository

Assurez-vous que votre code est sur GitHub (ou GitLab/Bitbucket).

**Fichiers nécessaires dans `backApi/` :**
- ✅ `main.py`
- ✅ `models.py`
- ✅ `gemini_service.py`
- ✅ `config.py`
- ✅ `requirements.txt`
- ✅ `Procfile` (créé)
- ✅ `runtime.txt` (créé)
- ✅ `railway.json` (créé)

### 2. Créer un Projet sur Railway

1. Allez sur [railway.app](https://railway.app) et connectez-vous
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Autorisez Railway à accéder à votre GitHub si nécessaire
5. Sélectionnez votre repository `BIT-customized-chatbox`
6. Railway détectera automatiquement que c'est un projet Python

### 3. Configurer le Service

1. Railway va créer un service automatiquement
2. Cliquez sur le service pour le configurer
3. Dans l'onglet **"Settings"**, configurez :
   - **Root Directory**: `backApi` (important !)
   - **Build Command**: Laissé vide (Railway le détectera automatiquement)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 4. Configurer les Variables d'Environnement

Dans l'onglet **"Variables"** de votre service Railway, ajoutez :

```
GEMINI_API_KEY=votre_cle_api_gemini_ici
CORS_ORIGINS=https://votre-frontend.vercel.app,http://localhost:5173
```

**Note importante :**
- Railway définit automatiquement `PORT`, vous n'avez pas besoin de le définir
- Remplacez `https://votre-frontend.vercel.app` par l'URL réelle de votre frontend en production
- Ajoutez toutes les URLs de votre frontend séparées par des virgules

### 5. Déployer

1. Railway va automatiquement détecter les changements et déployer
2. Vous pouvez aussi cliquer sur **"Deploy"** manuellement
3. Attendez que le déploiement se termine (environ 2-3 minutes)

### 6. Obtenir l'URL de votre API

1. Une fois déployé, Railway vous donnera une URL comme : `https://votre-projet.up.railway.app`
2. Cliquez sur **"Settings"** → **"Networking"** pour voir l'URL complète
3. Vous pouvez aussi générer un domaine personnalisé

### 7. Tester votre API

Ouvrez dans votre navigateur :
- `https://votre-projet.up.railway.app/health`
- `https://votre-projet.up.railway.app/docs` (documentation Swagger)

## 🔧 Configuration du Frontend

Une fois votre API déployée, mettez à jour votre frontend :

1. Créez un fichier `.env.production` dans `front_bit_ai/` :
```env
VITE_API_URL=https://votre-projet.up.railway.app
```

2. Ou mettez à jour directement dans `front_bit_ai/src/services/api.js` :
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://votre-projet.up.railway.app'
```

## 📝 Variables d'Environnement sur Railway

Variables à configurer dans Railway :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Clé API Google Gemini (obligatoire) | `AIzaSy...` |
| `CORS_ORIGINS` | URLs autorisées pour CORS | `https://mon-site.com,http://localhost:5173` |
| `PORT` | Port du serveur (défini automatiquement par Railway) | Ne pas définir |

## 🔍 Vérification

### Test de santé
```bash
curl https://votre-projet.up.railway.app/health
```

### Test de l'endpoint chat
```bash
curl -X POST "https://votre-projet.up.railway.app/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bonjour",
    "temperature": 0.7
  }'
```

## 🐛 Dépannage

### L'API ne démarre pas
- Vérifiez les logs dans Railway (onglet "Deployments" → "View Logs")
- Vérifiez que `GEMINI_API_KEY` est bien définie
- Vérifiez que le "Root Directory" est bien `backApi`

### Erreur CORS
- Vérifiez que `CORS_ORIGINS` contient l'URL exacte de votre frontend
- Assurez-vous qu'il n'y a pas d'espaces dans les URLs
- Redéployez après avoir modifié les variables d'environnement

### Erreur de port
- Railway définit automatiquement `PORT`, ne le définissez pas manuellement
- Vérifiez que le `Procfile` utilise `$PORT`

### Build échoue
- Vérifiez que `requirements.txt` est à jour
- Vérifiez les logs de build dans Railway
- Assurez-vous que Python 3.11 est disponible (vérifiez `runtime.txt`)

## 🔄 Mises à Jour

Pour mettre à jour votre API :
1. Poussez vos changements sur GitHub
2. Railway détectera automatiquement les changements
3. Un nouveau déploiement sera lancé automatiquement

Ou manuellement :
1. Allez dans Railway
2. Cliquez sur **"Redeploy"** dans l'onglet "Deployments"

## 💰 Coûts

Railway offre :
- **500 heures gratuites** par mois
- **$5 de crédit gratuit** par mois
- Parfait pour les projets personnels et de démonstration

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

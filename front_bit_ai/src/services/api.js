/**
 * Service API pour communiquer avec le backend Gemini
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Convertit les messages du format frontend vers le format backend
 */
function formatMessagesForBackend(messages) {
  if (!messages || messages.length === 0) return null
  
  return messages
    .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
}

/**
 * Envoie un message au backend et récupère la réponse de Gemini
 * 
 * @param {string} message - Le message de l'utilisateur
 * @param {Array} conversationHistory - L'historique de la conversation
 * @returns {Promise<string>} La réponse du chatbot
 */
export async function sendMessageToBackend(message, conversationHistory = []) {
  try {
    // Formater l'historique pour le backend
    const history = formatMessagesForBackend(conversationHistory)
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        conversation_history: history,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail || 
        `Erreur HTTP: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la récupération de la réponse')
    }

    return data.response
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    throw error
  }
}

/**
 * Vérifie si le backend est accessible
 * 
 * @returns {Promise<boolean>} True si le backend est accessible
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Backend non accessible:', error)
    return false
  }
}

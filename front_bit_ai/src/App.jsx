import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import WelcomePage from './components/WelcomePage'
import ConversationHistory from './components/ConversationHistory'

const initialUser = {
  name: 'Ali Coulibaly',
  role: 'Étudiant',
  initials: 'AC'
}

const BIT_DATA = {
  programmes: 'BIT propose des filières prestigieuses: Génie Logiciel, Intelligence Artificielle, Télécommunications, Cybersécurité, et Génie des Réseaux. Chaque programme dure 3 ans (Licence) ou 2 ans (Master).',
  admissions: 'Les admissions à BIT se font deux fois par an: Mars et Septembre. Conditions: BAC+2 minimum, tests d\'entrée, et entretien. Frais: 2.5M CFA/an pour nationaux, 5M pour étrangers.',
  diplomes: 'Les diplômés de BIT reçoivent un diplôme reconnu au niveau national et international. Taux d\'emploi: 92% dans les 6 mois post-graduation.',
  campus: 'Le campus principal de BIT est situé à Ouagadougou (Québec Avenue). Infrastructures: 5 labos informatiques, bibliothèque numérique, cafétéria, et espaces de coworking.',
  contact: 'Contact BIT:\nTéléphone: +226 25 00 00 00\nEmail: contact@bit.bf\nAdresse: Ouagadougou, Quartier Dassasgh\nSite: www.bit.bf'
}

const initialMessages = []

export default function App() {
  const [user] = useState(initialUser)
  const [messages, setMessages] = useState(initialMessages)
  const [isWelcome, setIsWelcome] = useState(true)
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('conversations')
    if (saved) {
      setConversations(JSON.parse(saved))
    }
  }, [])

  // Sauvegarder l'historique dans localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  function handleQuickQuestion(category) {
    startNewConversation()
    const userMsg = { id: Date.now(), sender: 'user', text: category }
    setMessages([userMsg])
    
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: BIT_DATA[category.toLowerCase()] || BIT_DATA.contact
      }
      setMessages((m) => [...m, reply])
    }, 500)
  }

  function startNewConversation() {
    const id = Date.now().toString()
    setCurrentConversationId(id)
    setIsWelcome(false)
    setMessages([])
  }

  function saveConversation() {
    if (messages.length > 0 && currentConversationId) {
      const title = messages[0]?.text?.substring(0, 30) || 'Nouvelle conversation'
      setConversations((prev) => {
        const updated = [...prev]
        const index = updated.findIndex((c) => c.id === currentConversationId)
        if (index >= 0) {
          updated[index] = {
            id: currentConversationId,
            title,
            messages: JSON.parse(JSON.stringify(messages)),
            timestamp: new Date().toLocaleString('fr-FR')
          }
        } else {
          updated.push({
            id: currentConversationId,
            title,
            messages: JSON.parse(JSON.stringify(messages)),
            timestamp: new Date().toLocaleString('fr-FR')
          })
        }
        return updated
      })
    }
  }

  function handleGoBack() {
    saveConversation()
    setIsWelcome(true)
    setMessages([])
    setCurrentConversationId(null)
  }

  function loadConversation(conversation) {
    setCurrentConversationId(conversation.id)
    setMessages(conversation.messages)
    setIsWelcome(false)
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentConversationId === id) {
      handleGoBack()
    }
  }

  function handleSend(text) {
    if (!text) return
    setIsWelcome(false)
    const userMsg = { id: Date.now(), sender: 'user', text }
    setMessages((m) => [...m, userMsg])

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateBotReply(text)
      }
      setMessages((m) => [...m, reply])
    }, 800)
  }

  function generateBotReply(query) {
    const q = query.toLowerCase()
    if (q.includes('programme') || q.includes('filière')) return BIT_DATA.programmes
    if (q.includes('admission') || q.includes('inscription')) return BIT_DATA.admissions
    if (q.includes('diplôme') || q.includes('diplome')) return BIT_DATA.diplomes
    if (q.includes('campus') || q.includes('adresse') || q.includes('localisation')) return BIT_DATA.campus
    if (q.includes('contact') || q.includes('téléphone') || q.includes('telephone') || q.includes('email')) return BIT_DATA.contact
    return "Je peux vous aider avec: Programmes, Admissions, Diplômes, Campus, ou Contact. Que souhaitez-vous savoir ?"
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <ConversationHistory
          conversations={conversations}
          onLoadConversation={loadConversation}
          onDeleteConversation={deleteConversation}
          currentConversationId={currentConversationId}
        />
        <div className="app-content">
          {isWelcome && <WelcomePage user={user} onQuickQuestion={handleQuickQuestion} onSend={handleSend} />}
          {!isWelcome && (
            <ChatWindow
              user={user}
              messages={messages}
              onSend={handleSend}
              onGoBack={handleGoBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}

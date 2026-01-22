import React, { useState } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import WelcomePage from './components/WelcomePage'

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

  function handleQuickQuestion(category) {
    setIsWelcome(false)
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
      {isWelcome && <WelcomePage user={user} onQuickQuestion={handleQuickQuestion} onSend={handleSend} />}
      {!isWelcome && <ChatWindow user={user} messages={messages} onSend={handleSend} />}
    </div>
  )
}

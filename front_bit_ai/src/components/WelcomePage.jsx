import React from 'react'

const categories = [
  { label: 'Programmes', icon: '📚' },
  { label: 'Admissions', icon: '📋' },
  { label: 'Diplômes', icon: '🎓' },
  { label: 'Campus', icon: '👥' },
  { label: 'Contact', icon: '☎️' }
]

export default function WelcomePage({ user, onQuickQuestion, onSend }) {
  const handleQuickClick = (label) => {
    onQuickQuestion(label)
  }

  return (
    <div className="welcome-page">
      <div className="welcome-icon">
        <img src="/logo.png" alt="BIT Logo" className="welcome-logo-img" />
      </div>
      <h1 className="welcome-title">Bienvenue sur BIT Assistant</h1>
      <p className="welcome-subtitle">
        Je suis votre assistant virtuel dédié au Burkina Institute of Technology. Posez-moi vos questions sur les programmes, les admissions, le campus et plus encore!
      </p>
      <div className="welcome-hint">
        <span>●</span>
        <span>Sélectionnez une question rapide ou tapez votre message</span>
      </div>
      
      <div className="quick-buttons">
        {categories.map((cat) => (
          <button 
            key={cat.label}
            className="quick-btn"
            onClick={() => handleQuickClick(cat.label)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <QuickInput onSend={onSend} />
          <div className="input-hint">Appuyez sur Entrée pour envoyer, Shift+Entrée pour un retour à la ligne</div>
        </div>
      </div>
    </div>
  )
}

function QuickInput({ onSend }) {
  const [text, setText] = React.useState('')

  function submit() {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Posez votre question sur BIT..."
        style={{ flex: 1 }}
      />
      <button className="send-btn" onClick={submit} title="Envoyer">
        ➤
      </button>
    </div>
  )
}

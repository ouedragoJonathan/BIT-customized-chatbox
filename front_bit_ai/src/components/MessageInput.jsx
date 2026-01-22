import React, { useState } from 'react'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

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
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question sur BIT..."
          rows="1"
        />
        <div className="input-hint">Appuyez sur Entrée pour envoyer, Shift+Entrée pour un retour à la ligne</div>
      </div>
      <button className="send-btn" onClick={submit} title="Envoyer">
        ➤
      </button>
    </div>
  )
}

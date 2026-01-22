import React, { useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ user, messages, onSend, onGoBack }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="main-chat">
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="back-btn" onClick={onGoBack} title="Retour">
            ← Retour
          </button>
          <div className="title">Chat — BIT Assistant</div>
          <div className="desc">Conversation personnalisée pour <strong>{user.name}</strong></div>
        </div>
      </div>

      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`msg-row ${m.sender}`}>
            <MessageBubble message={m} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  )
}

import React, { useState } from 'react'

export default function ConversationHistory({
  conversations,
  onLoadConversation,
  onDeleteConversation,
  currentConversationId
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <aside className={`conversation-history ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="history-header">
        <button
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Réduire' : 'Développer'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
        {isExpanded && <h3>Historique</h3>}
      </div>

      {isExpanded && (
        <div className="history-list">
          {conversations.length === 0 ? (
            <div className="empty-history">Aucune conversation</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`history-item ${
                  currentConversationId === conv.id ? 'active' : ''
                }`}
              >
                <div
                  className="history-item-content"
                  onClick={() => onLoadConversation(conv)}
                >
                  <div className="history-title">{conv.title}</div>
                  <div className="history-time">{conv.timestamp}</div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                  title="Supprimer"
                >
                  🗑️ 
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  )
}

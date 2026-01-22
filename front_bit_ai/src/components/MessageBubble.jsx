import React from 'react'

export default function MessageBubble({ message }){
  const cls = message.sender === 'user' ? 'bubble user' : 'bubble bot'
  return (
    <div className={cls}>
      {message.text}
    </div>
  )
}

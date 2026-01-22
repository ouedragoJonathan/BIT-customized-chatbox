import React from 'react'

export default function Sidebar({ user, onQuickAsk }){
  const topics = [
    'Admission',
    'Programmes & Filières',
    'Contacts & Adresse',
    'Bourses & Financement'
  ]

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">{user.initials}</div>
        <div className="user-meta">
          <div className="name">{user.name}</div>
          <div className="role">{user.role} • BIT</div>
        </div>
      </div>

      <div style={{marginTop:8,color:'#5b5b5b',fontWeight:600}}>Sujets rapides</div>
      <div className="topics">
        {topics.map((t)=> (
          <div key={t} className="topic" onClick={()=> onQuickAsk(t)}>{t}</div>
        ))}
      </div>

      <div style={{marginTop:'auto',fontSize:13,color:'#9a9a9a'}}>
        BIT — Burkina Institute of Technology
      </div>
    </aside>
  )
}

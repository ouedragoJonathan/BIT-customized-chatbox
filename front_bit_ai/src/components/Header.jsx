import React from 'react'

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <img src="/logo.png" alt="BIT Logo" className="logo-img" />
        </div>
        <div className="header-title">
          <div className="main">BIT Assistant</div>
          <div className="sub">Burkina Institute of Technology</div>
        </div>
      </div>
      <div className="status-badge">● En ligne</div>
    </header>
  )
}

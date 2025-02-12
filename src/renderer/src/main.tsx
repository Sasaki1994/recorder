import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Timeshift from './Timeshift'

// ウィンドウごとにレンダリング

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

const timeshift = document.getElementById('timeshift')
if (timeshift) {
  ReactDOM.createRoot(timeshift).render(
    <React.StrictMode>
      <Timeshift />
    </React.StrictMode>
  )
}

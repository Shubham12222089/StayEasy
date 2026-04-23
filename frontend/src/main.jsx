import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)

const renderBootstrap = (title, message, details = '') => {
  root.render(
    <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
      <div className="container">
        <div className="card mx-auto max-w-2xl p-8 text-center">
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-3 text-slate-600">{message}</p>
          {details ? (
            <pre className="mt-6 overflow-auto rounded-xl bg-slate-950 p-4 text-left text-xs text-slate-100">
              {details}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  )
}

renderBootstrap('StayEasy is starting...', 'Loading the frontend application.')

Promise.resolve()
  .then(() => import('./App'))
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
  .catch((error) => {
    console.error('Failed to load App:', error)
    renderBootstrap(
      'StayEasy failed to start',
      'A module or runtime error occurred while loading the app.',
      String(error?.stack || error?.message || error)
    )
  })

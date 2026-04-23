import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-4 py-16">
          <div className="container">
            <div className="card mx-auto max-w-2xl p-8 text-center">
              <h1 className="text-3xl font-black text-slate-900">StayEasy failed to load</h1>
              <p className="mt-3 text-slate-600">
                A runtime error occurred while rendering the app. Please refresh the page.
              </p>
              <pre className="mt-6 overflow-auto rounded-xl bg-slate-950 p-4 text-left text-xs text-slate-100">
                {String(this.state.error?.message || this.state.error || 'Unknown error')}
              </pre>
              <button className="btn-primary mt-6" onClick={() => window.location.reload()}>
                Refresh page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

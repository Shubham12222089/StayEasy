import React from 'react'
import { Hotel } from './ui-icons'

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-sm">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <Hotel className="h-5 w-5" />
            </span>
            <div>
              <span className="text-sm font-bold text-slate-900">StayEasy</span>
              <span className="text-xs text-slate-400 ml-2">Premium hotel booking</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} StayEasy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Info } from './ui-icons'

const Alert = ({ type = 'info', title, message, onClose, autoClose = false, duration = 4000 }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const styles = {
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
      close: 'hover:bg-red-100'
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
      close: 'hover:bg-emerald-100'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      close: 'hover:bg-blue-100'
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500',
      close: 'hover:bg-amber-100'
    }
  }

  const s = styles[type] || styles.info
  const Icon = { error: AlertCircle, success: CheckCircle, info: Info, warning: AlertCircle }[type]

  return (
    <div
      className={`${s.bg} ${s.border} border rounded-xl p-4 mb-4 flex items-start gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.bg} ${s.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {title && <h4 className={`${s.text} font-bold text-sm`}>{title}</h4>}
        <p className={`${s.text} text-sm leading-relaxed`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${s.text} ${s.close} shrink-0 rounded-lg p-1.5 transition-all duration-200 hover:scale-110 active:scale-90`}
          aria-label="Close alert"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert

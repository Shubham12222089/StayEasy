import React from 'react'
import { AlertCircle, CheckCircle, Info } from './ui-icons'

const Alert = ({ type = 'info', title, message, onClose }) => {
  const bgColor = {
    error: 'bg-red-50',
    success: 'bg-green-50',
    info: 'bg-blue-50',
    warning: 'bg-yellow-50'
  }[type]

  const textColor = {
    error: 'text-red-800',
    success: 'text-green-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800'
  }[type]

  const borderColor = {
    error: 'border-red-200',
    success: 'border-green-200',
    info: 'border-blue-200',
    warning: 'border-yellow-200'
  }[type]

  const Icon = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle
  }[type]

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${textColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1">
        {title && <h4 className={`${textColor} font-semibold`}>{title}</h4>}
        <p className={`${textColor} text-sm`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-75 transition ml-2`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert

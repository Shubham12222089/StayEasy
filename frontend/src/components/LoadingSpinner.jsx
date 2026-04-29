import React from 'react'

const LoadingSpinner = ({ message = 'Loading...', compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-b-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-sm text-slate-500 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-blue-100 rounded-full" />
          <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-1 w-12 h-12 border-4 border-transparent border-b-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-700 font-semibold">{message}</p>
          <p className="text-sm text-slate-400 mt-1">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner

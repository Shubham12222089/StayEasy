import React, { useState } from 'react'
import { Star } from './ui-icons'

const RatingStars = ({ rating = 0, onRate = null, interactive = false, size = 'md', showValue = true, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const containerSizeClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
    xl: 'gap-2'
  }

  const displayRating = hoverRating || rating

  const handleRate = async (value) => {
    if (readOnly || !interactive || !onRate) return

    setIsSubmitting(true)
    try {
      await onRate(value)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2000)
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center ${containerSizeClasses[size]} ${interactive && !readOnly ? 'cursor-pointer' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting || readOnly}
            onMouseEnter={() => interactive && !readOnly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            className={`transition-all duration-200 ${
              star <= displayRating ? 'text-amber-400 drop-shadow-md' : 'text-slate-300'
            } ${interactive && !readOnly ? 'hover:scale-110 active:scale-95' : ''} ${
              isSubmitting ? 'opacity-50' : ''
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star className={`${sizeClasses[size]} fill-current`} />
          </button>
        ))}
        {showValue && (
          <span className={`ml-2 font-semibold ${displayRating > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
            {displayRating > 0 ? displayRating.toFixed(1) : 'N/A'}
          </span>
        )}
      </div>

      {interactive && !readOnly && (
        <div className="min-h-5">
          {submitted && (
            <p className="text-xs font-semibold text-emerald-600 animate-fade-in">✓ Rating submitted successfully!</p>
          )}
          {isSubmitting && (
            <p className="text-xs font-semibold text-blue-600">Submitting...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default RatingStars

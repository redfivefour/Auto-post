import { useState } from 'react'
import { Star } from 'lucide-react'

export function StarRating({ value, onChange, max = 10, size = 'md' }) {
  const [hover, setHover] = useState(null)

  const sz = size === 'sm' ? 14 : size === 'lg' ? 22 : 18
  const stars = max === 10 ? 10 : 5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: stars }, (_, i) => {
        const starVal = i + 1
        const filled = (hover ?? value ?? 0) >= starVal
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(starVal === value ? null : starVal)}
            onMouseEnter={() => setHover(starVal)}
            onMouseLeave={() => setHover(null)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              size={sz}
              className={`transition-colors duration-100 ${filled ? 'fill-amber-400 stroke-amber-400' : 'fill-transparent stroke-gray-600'}`}
            />
          </button>
        )
      })}
      {value != null && (
        <span className="ml-2 text-sm text-amber-400 font-semibold tabular-nums">
          {value}<span className="text-gray-500">/{stars}</span>
        </span>
      )}
    </div>
  )
}

export function StarDisplay({ value, max = 10, size = 'sm' }) {
  if (value == null) return <span className="text-xs text-gray-600">Not rated</span>
  const sz = size === 'xs' ? 10 : size === 'sm' ? 12 : 16
  const stars = max === 10 ? 10 : 5
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: stars }, (_, i) => (
        <Star
          key={i}
          size={sz}
          className={i < value ? 'fill-amber-400 stroke-amber-400' : 'fill-transparent stroke-gray-700'}
        />
      ))}
      <span className="ml-1 text-xs text-amber-400 font-semibold">{value}/{stars}</span>
    </div>
  )
}

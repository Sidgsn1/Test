import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  showScore = false,
  scoreClass = 'text-slate-700 font-semibold'
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const starSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFull = rating >= starValue;
          const isHalf = !isFull && rating >= starValue - 0.5;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              className={`p-0.5 transition-transform ${
                interactive ? 'cursor-pointer hover:scale-110 focus:outline-none' : 'cursor-default pointer-events-none'
              }`}
              title={`${starValue} Star`}
            >
              <div className="relative">
                {/* Background Empty Star */}
                <Star
                  className={`${starSize} text-slate-200 fill-slate-100 transition-colors ${
                    interactive ? 'hover:text-amber-300' : ''
                  }`}
                />
                {/* Filled Overlay */}
                {(isFull || isHalf) && (
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: isFull ? '100%' : '50%' }}
                  >
                    <Star className={`${starSize} text-amber-400 fill-amber-400`} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className={`text-sm ${scoreClass}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;

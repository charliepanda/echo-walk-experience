
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TextDisplayProps } from '@/types';

const TextDisplay: React.FC<TextDisplayProps> = ({ text, isTransitioning }) => {
  const [displayText, setDisplayText] = useState(text);
  const [animationState, setAnimationState] = useState<'fade-in' | 'fade-out' | 'stable'>('stable');

  useEffect(() => {
    if (isTransitioning) {
      setAnimationState('fade-out');
      const timer = setTimeout(() => {
        setDisplayText(text);
        setAnimationState('fade-in');
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setDisplayText(text);
      setAnimationState('fade-in');
    }
  }, [text, isTransitioning]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-6">
      <p 
        className={cn(
          "text-center font-medium text-2xl md:text-4xl tracking-tight",
          animationState === 'fade-in' && "animate-fade-in",
          animationState === 'fade-out' && "animate-fade-out",
          "transition-opacity duration-500 ease-in-out"
        )}
      >
        {displayText}
      </p>
      <div className="mt-12 opacity-50">
        <p className="text-sm font-mono uppercase tracking-widest animate-pulse-subtle">
          Press ↑ to continue
        </p>
      </div>
    </div>
  );
};

export default TextDisplay;

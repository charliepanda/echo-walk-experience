
import React, { useEffect, useState } from 'react';

const FootstepsAnimation: React.FC = () => {
  const [steps, setSteps] = useState<{ id: number; left: number; top: number }[]>([]);
  
  useEffect(() => {
    // Create footsteps every 500ms
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        // Remove older steps if there are more than 8
        const newSteps = prevSteps.length >= 8 
          ? [...prevSteps.slice(prevSteps.length - 7)] 
          : [...prevSteps];
          
        // Add a new step with random position (centered in middle third of screen)
        return [
          ...newSteps, 
          { 
            id: Date.now(), 
            left: 40 + Math.random() * 20, // 40-60% from left
            top: 30 + Math.random() * 40,  // 30-70% from top
          }
        ];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-5 pointer-events-none">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className="absolute w-8 h-12 opacity-50"
          style={{ 
            left: `${step.left}%`, 
            top: `${step.top}%`,
            opacity: (index / steps.length) * 0.5,
            transform: index % 2 === 0 ? 'rotate(10deg)' : 'rotate(-10deg)',
          }}
        >
          <div className="w-4 h-8 bg-white rounded-full animate-pulse-subtle"></div>
        </div>
      ))}
    </div>
  );
};

export default FootstepsAnimation;

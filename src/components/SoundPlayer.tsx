
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SoundPlayerProps } from '@/types';
import TextDisplay from './TextDisplay';

const SoundPlayer: React.FC<SoundPlayerProps> = ({ 
  sounds, 
  transitionSound,
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const transitionSoundRef = useRef<HTMLAudioElement | null>(null);

  // Create audio elements for main sound and transition sound
  useEffect(() => {
    soundRef.current = new Audio();
    transitionSoundRef.current = new Audio(transitionSound);
    
    // Initial sound loading
    if (sounds.length > 0) {
      soundRef.current.src = sounds[currentIndex].file;
      soundRef.current.load();
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current = null;
      }
      if (transitionSoundRef.current) {
        transitionSoundRef.current.pause();
        transitionSoundRef.current = null;
      }
    };
  }, []);

  // Play the current sound
  useEffect(() => {
    if (!soundRef.current || sounds.length === 0) return;
    
    soundRef.current.src = sounds[currentIndex].file;
    soundRef.current.load();
    
    const playSound = async () => {
      try {
        await soundRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing sound:", error);
        setIsPlaying(false);
      }
    };
    
    playSound();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
      }
    };
  }, [currentIndex, sounds]);

  // Handle keyboard events for navigation
  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && !isTransitioning && sounds.length > 0) {
      setIsTransitioning(true);
      
      // Pause current sound
      if (soundRef.current) {
        soundRef.current.pause();
      }
      
      // Play transition sound
      try {
        if (transitionSoundRef.current) {
          transitionSoundRef.current.currentTime = 0;
          await transitionSoundRef.current.play();
        }
      } catch (error) {
        console.error("Error playing transition sound:", error);
      }
      
      // After transition sound completes or after a delay, move to next sound
      const transitionDuration = transitionSoundRef.current?.duration || 1;
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sounds.length);
        setIsTransitioning(false);
      }, transitionDuration * 1000);
    }
  }, [isTransitioning, sounds.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle initial autoplay (requires user interaction in most browsers)
  const handleInitialPlay = async () => {
    if (soundRef.current && !isPlaying) {
      try {
        await soundRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error during initial play:", error);
      }
    }
  };

  if (sounds.length === 0) {
    return <div className="text-center p-8">No sounds available</div>;
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative"
      onClick={handleInitialPlay}
    >
      <TextDisplay 
        text={sounds[currentIndex].description} 
        isTransitioning={isTransitioning}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
          <button 
            onClick={handleInitialPlay}
            className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Start Experience
          </button>
        </div>
      )}
    </div>
  );
};

export default SoundPlayer;

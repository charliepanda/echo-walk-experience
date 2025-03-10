
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SoundPlayerProps } from '@/types';
import TextDisplay from './TextDisplay';
import FootstepsAnimation from './FootstepsAnimation';

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
    
    // Auto-play sound when component mounts
    const playInitialSound = async () => {
      if (soundRef.current) {
        try {
          await soundRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error playing initial sound:", error);
        }
      }
    };
    
    playInitialSound();
    
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

  // Only load the sound when index changes, don't play during transition
  useEffect(() => {
    if (!soundRef.current || sounds.length === 0) return;
    
    soundRef.current.src = sounds[currentIndex].file;
    soundRef.current.load();
    
    // Only play if we're not in a transition
    if (!isTransitioning) {
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
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
      }
    };
  }, [currentIndex, sounds, isTransitioning]);

  // Handle keyboard events for navigation
  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && !isTransitioning && sounds.length > 0) {
      setIsTransitioning(true);
      
      // Pause current sound
      if (soundRef.current) {
        soundRef.current.pause();
        setIsPlaying(false);
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
      
      // Wait for the full transition (4 seconds) before changing to next sound
      setTimeout(() => {
        // Change to next sound
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sounds.length);
        
        // After the index has changed and new sound is loaded, mark transition as complete
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100); // Small delay to ensure the sound has loaded
      }, 4000);
    }
  }, [isTransitioning, sounds.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (sounds.length === 0) {
    return <div className="text-center p-8">No sounds available</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative">
      <TextDisplay 
        text={sounds[currentIndex].description} 
        isTransitioning={isTransitioning}
      />
      
      {isTransitioning && <FootstepsAnimation />}
    </div>
  );
};

export default SoundPlayer;


import React from 'react';
import SoundPlayer from '@/components/SoundPlayer';
import { soundData, TRANSITION_SOUND } from '@/lib/sounds';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <SoundPlayer 
        sounds={soundData}
        transitionSound={TRANSITION_SOUND}
      />
    </div>
  );
};

export default Index;

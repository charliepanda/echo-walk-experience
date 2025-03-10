
export interface Sound {
  id: number;
  description: string;
  file: string;
}

export interface SoundPlayerProps {
  sounds: Sound[];
  transitionSound: string;
  initialIndex?: number;
}

export interface TextDisplayProps {
  text: string;
  isTransitioning: boolean;
}

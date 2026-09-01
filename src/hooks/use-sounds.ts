import { useContext } from 'react';
import { SoundContext } from '../components/sound-provider';

export default function useSounds() {
  const context = useContext(SoundContext);

  if (context === undefined) {
    throw new Error('useSounds must be used within a SoundProvider');
  }

  return context;
}

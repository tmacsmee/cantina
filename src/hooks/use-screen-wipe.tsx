import { useContext } from 'react';
import { ScreenWipeContext } from '../components/screen-wipe-provider';

export function useScreenWipe() {
  const context = useContext(ScreenWipeContext);

  if (context === undefined) {
    throw new Error('useScreenWipe must be used within a ScreenWipeProvider');
  }

  return context;
}

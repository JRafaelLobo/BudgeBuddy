
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function ScreenInicio() {
  useEffect(() => {
    router.replace('/(tabs)/Resumen');
  }, []);

  return null;
}


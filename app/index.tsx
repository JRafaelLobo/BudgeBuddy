import { User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';


const STORAGE_USER_KEY = '@user'

export default function ScreenInicio() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_USER_KEY);
        setUser(json ? JSON.parse(json) : null);
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        router.replace('/(tabs)/finance');
      } else {
        router.replace('/(auth)/login'); 
      }
    }
  }, [user]);
  return null;
}


import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const STORAGE_KEY = '@user_profile';

export default function ProfileIndex() {
  const { colors, dark } = useTheme();
  const [profile, setProfile] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const json = await AsyncStorage.getItem(STORAGE_KEY);
          if (json) {
            setProfile(JSON.parse(json));
          } else {
            // Datos iniciales por defecto
            const initial = {
              name: 'Matías López',
              email: 'matias@example.com',
              age: 18,
              country: 'Honduras',
              image:
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            };
            setProfile(initial);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
          }
        } catch (e) {
          console.error('Error cargando perfil', e);
        }
      };
      loadProfile();
    }, [])
  );

  const handleCloseSession = async () => {
    Alert.alert('Cerrar Sessión', '¿Deseas cerrar sessión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setProfile(null);
          } catch (e) {
            console.error('Error eliminando perfil', e);
          }
        },
      },
    ]);
  };

  if (!profile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 50 }}>
          No hay datos de perfil guardados
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, marginTop: 20 }]}
          onPress={() => router.push('/(tabs)/profile/edit')}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Crear Perfil
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <Image source={{ uri: profile.image }} style={styles.avatar} />

        <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
        <Text style={[styles.info, { color: colors.text }]}>
          📧 {profile.email}
        </Text>
        <Text style={[styles.info, { color: colors.text }]}>
          🎂 Edad: {profile.age}
        </Text>
        <Text style={[styles.info, { color: colors.text }]}>
          🌎 País: {profile.country}
        </Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/profile/edit')}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          onPress={handleCloseSession}
        >
          <MaterialIcons name="logout" size={20} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Cerrar Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700' },
  profileCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff2',
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: { fontWeight: '700', textAlign: 'center' },
});

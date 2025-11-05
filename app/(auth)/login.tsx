import { User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const STORAGE_KEY = '@users_profile';
const STORAGE_USER_KEY = '@user'

export default function LoginScreen() {
    console.log('AsyncStorage:', AsyncStorage ? 'OK' : 'NULL');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            const currentUsuarios = json ? JSON.parse(json) : [];

            const user = currentUsuarios.find(
                (u: User) => u.email === email && u.password === password
            );

            if ((email === 'user@test.com' && password === '1234') || user) {
                const currentUser = user || { email, password, name: 'Usuario de prueba' };
                await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
                console.log('Usuario guardado correctamente:', currentUser);
                router.replace('/(tabs)/finance');
                Alert.alert('Éxito', 'Inicio de Sessión Exitoso');
                return true;
            } else {
                Alert.alert('Rechazado', 'El correo o la clave son incorrectas');
                console.log('Credenciales inválidas');
                return false;
            }
        } catch (error) {
            Alert.alert('Error', 'Error al iniciar sesión');
            console.error('Error al iniciar sesión:', error);
            return false;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 40, textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    link: { textAlign: 'center', marginTop: 20, color: '#3498db' },
});

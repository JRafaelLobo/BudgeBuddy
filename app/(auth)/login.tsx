import { User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const STORAGE_KEY = '@users_profile';
const STORAGE_USER_KEY = '@user'
const { width, height } = Dimensions.get('window');

const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;
const normalize = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size));
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
        padding: wp(5), // 5% of screen width
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: normalize(24), // scales with pixel density
        fontWeight: '700',
        marginBottom: hp(7), // 5% of screen height
        textAlign: 'center',
    },
    inputGroup: { margin: hp(1) },
    label: {
        fontSize: normalize(14),
        marginBottom: hp(1),
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        paddingHorizontal: wp(3),
        height: hp(6), // scales with screen height
        fontSize: normalize(14),
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: hp(2),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: hp(5), 
        margin: hp(1)
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: normalize(16),
    },
    link: {
        textAlign: 'center',
        marginTop: hp(3),
        color: '#3498db',
        fontSize: normalize(14),
    },
});


import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STORAGE_KEY = '@users_profile';
const STORAGE_USER_KEY = '@user'


export default function RegisterScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState<'Estudia' | 'Trabaja' | null>(null);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setBirthDate(selectedDate);
    };

    const handleRegister = async () => {
        if (!email || !password || !birthDate || !status) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            const newUser = {
                id: Date.now().toString(),
                email: email,
                password: password,
                birthDate: birthDate,
                status: status
            };
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            const currentsUsuarios = json ? JSON.parse(json) : [];
            const newUsuarios = [...currentsUsuarios, newUser];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsuarios));
            await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser))
            console.log('Transacción guardada:', newUser);
            Alert.alert('Éxito', 'Cuenta creada correctamente');
            router.replace('/(tabs)/finance');
        } catch (e) {
            console.error('Error guardando transacción', e);
        }

        console.log({ email, password, birthDate, status });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo</Text>
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

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>
                        {birthDate
                            ? birthDate.toLocaleDateString()
                            : 'Selecciona tu fecha de nacimiento'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthDate || new Date(2000, 0, 1)}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.statusRow}>
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            status === 'Estudia' && styles.statusSelected,
                        ]}
                        onPress={() => setStatus('Estudia')}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                status === 'Estudia' && { color: '#fff' },
                            ]}
                        >
                            Estudia
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            status === 'Trabaja' && styles.statusSelected,
                        ]}
                        onPress={() => setStatus('Trabaja')}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                status === 'Trabaja' && { color: '#fff' },
                            ]}
                        >
                            Trabaja
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 40, textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        justifyContent: 'center',
    },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    statusButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    statusSelected: { backgroundColor: '#2ecc71' },
    statusText: { fontWeight: '600', color: '#2ecc71' },
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

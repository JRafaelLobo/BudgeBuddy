
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    PixelRatio,
    Platform,
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
const wp = (percentage:number) => (width * percentage) / 100;
const hp = (percentage:number) => (height * percentage) / 100;
const normalize = (size:number) => Math.round(PixelRatio.roundToNearestPixel(size));

export default function RegisterScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState<'Estudia' | 'Trabaja' | null>(null);
    const [name, setname]= useState('');


    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setBirthDate(selectedDate);
    };

    const handleRegister = async () => {
        if (!email || !password || !birthDate || !status || !name) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            const newUser = {
                id: Date.now().toString(),
                email: email,
                password: password,
                birthDate: birthDate,
                status: status,
                name: name,
                premium: false
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

        console.log({ email, password, birthDate, status, name });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registro</Text>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    placeholder="Introduzca su nombre"
                    autoCapitalize="none"
                    value={name}
                    onChangeText={setname}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
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
                     //placeholderTextColor="#888"
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
    container: {
        flex: 1,
        padding: wp(3), // 5% of screen width
        justifyContent: 'center',
        backgroundColor: '#fff',
        display: 'flex'
        
    },
    title: {
        fontSize: normalize(24), // scales with pixel density
        fontWeight: '700',
        marginBottom: hp(4), // 4% of screen height
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
        justifyContent: 'center',
        color: 'black'
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(3),
    },
    statusButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 8,
        padding: hp(2),
        alignItems: 'center',
    },
    statusSelected: { backgroundColor: '#2ecc71' },
    statusText: {
        fontWeight: '600',
        color: '#2ecc71',
        fontSize: normalize(14),
    },
    button: {
        backgroundColor: '#2ecc71',
        padding: hp(2),
        borderRadius: 8,
        alignItems: 'center',
        margin: hp(1),
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



/*const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
    inputGroup: { marginBottom: 15 },
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
});*/

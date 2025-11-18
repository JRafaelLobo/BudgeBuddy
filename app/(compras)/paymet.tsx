import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type PaymentMethod = 'card' | 'paypal' | 'bank';

const STORAGE_KEY_USER = '@user';
const plans = {
    monthly: {
        price: 65,
        period: 'mes',
        savings: null,
    },
    annual: {
        price: 600,
        period: 'año',
        savings: '25% de descuento',
        monthlyEquivalent: 50,
    },
};

export default function Payment() {
    const { colors, dark } = useTheme();
    const params = useLocalSearchParams<{ plan?: 'monthly' | 'annual'; price?: string }>();
    const plan = params.plan || 'monthly';
    const price = Number(params.price) || 99;
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [loading, setLoading] = useState(false);

    // Estados para tarjeta
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Estados para PayPal
    const [paypalEmail, setPaypalEmail] = useState('');

    // Estados para transferencia bancaria
    const [bankAccount, setBankAccount] = useState('');
    const [bankName, setBankName] = useState('');

    const planDetails = {
        monthly: { name: 'Plan Mensual', period: 'mes', price: 99 },
        annual: { name: 'Plan Anual', period: 'año', price: 899 },
    };

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        setCardNumber(formatted.substring(0, 19));
    };

    const formatExpiryDate = (text: string) => {
        const cleaned = text.replace(/\//g, '');
        if (cleaned.length >= 2) {
            setExpiryDate(cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4));
        } else {
            setExpiryDate(cleaned);
        }
    };

    const handlePayment = async () => {
        if (paymentMethod === 'card') {
            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                Alert.alert('Error', 'Por favor completa todos los campos de la tarjeta');
                return;
            }
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                Alert.alert('Error', 'Número de tarjeta inválido');
                return;
            }
            if (cvv.length !== 3) {
                Alert.alert('Error', 'CVV inválido');
                return;
            }
        } else if (paymentMethod === 'paypal') {
            if (!paypalEmail) {
                Alert.alert('Error', 'Por favor ingresa tu email de PayPal');
                return;
            }
        } else if (paymentMethod === 'bank') {
            if (!bankAccount || !bankName) {
                Alert.alert('Error', 'Por favor completa los datos bancarios');
                return;
            }
        }

        setLoading(true);

        // Simular procesamiento de pago
        setTimeout(async () => {
            try {
                // Actualizar el estado premium del usuario
                const userJson = await AsyncStorage.getItem(STORAGE_KEY_USER);
                if (userJson) {
                    const user = JSON.parse(userJson);
                    user.premium = true;
                    user.subscriptionPlan = plan;
                    user.subscriptionDate = new Date().toISOString();
                    await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
                }

                setLoading(false);

                Alert.alert(
                    '¡Pago exitoso! 🎉',
                    `Has activado tu ${planDetails[plan].name}. Disfruta de todas las funciones premium.`,
                    [
                        {
                            text: 'Continuar',
                            onPress: () => { },
                        },
                    ]
                );
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Hubo un problema al procesar el pago. Intenta nuevamente.');
            }
        }, 2000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header con botón de regresar */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { }}>
                        <MaterialIcons name="emoji-events" size={20} color={colors.background} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Confirmar Pago</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Resumen de suscripción */}
                <View style={[styles.summaryCard, { backgroundColor: dark ? '#1a1a1a' : '#fff' }]}>
                    <View style={styles.summaryHeader}>
                        <Text style={[styles.summaryTitle, { color: colors.text }]}>
                            {planDetails[plan].name}
                        </Text>
                    </View>

                    <View style={styles.summaryDetails}>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: dark ? '#aaa' : '#666' }]}>
                                Periodo:
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                1 {planDetails[plan].period}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: dark ? '#aaa' : '#666' }]}>
                                Subtotal:
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                Lps {price.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
                            <Text style={[styles.totalValue, { color: '#4CAF50' }]}>
                                Lps {price.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Métodos de pago */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Método de Pago
                </Text>

                <View style={styles.paymentMethods}>
                    {/* Tarjeta de crédito/débito */}
                    <TouchableOpacity
                        style={[
                            styles.paymentMethodCard,
                            {
                                backgroundColor: dark ? '#1a1a1a' : '#fff',
                                borderColor: paymentMethod === 'card' ? '#4CAF50' : (dark ? '#333' : '#e0e0e0'),
                                borderWidth: paymentMethod === 'card' ? 2 : 1,
                            },
                        ]}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <Ionicons
                            name="card"
                            size={24}
                            color={paymentMethod === 'card' ? '#4CAF50' : (dark ? '#888' : '#666')}
                        />
                        <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                            Tarjeta de Crédito/Débito
                        </Text>
                        {paymentMethod === 'card' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        )}
                    </TouchableOpacity>

                    {/* PayPal */}
                    <TouchableOpacity
                        style={[
                            styles.paymentMethodCard,
                            {
                                backgroundColor: dark ? '#1a1a1a' : '#fff',
                                borderColor: paymentMethod === 'paypal' ? '#4CAF50' : (dark ? '#333' : '#e0e0e0'),
                                borderWidth: paymentMethod === 'paypal' ? 2 : 1,
                            },
                        ]}
                        onPress={() => setPaymentMethod('paypal')}
                    >
                        <Ionicons
                            name="logo-paypal"
                            size={24}
                            color={paymentMethod === 'paypal' ? '#4CAF50' : (dark ? '#888' : '#666')}
                        />
                        <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                            PayPal
                        </Text>
                        {paymentMethod === 'paypal' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        )}
                    </TouchableOpacity>

                    {/* Transferencia bancaria */}
                    <TouchableOpacity
                        style={[
                            styles.paymentMethodCard,
                            {
                                backgroundColor: dark ? '#1a1a1a' : '#fff',
                                borderColor: paymentMethod === 'bank' ? '#4CAF50' : (dark ? '#333' : '#e0e0e0'),
                                borderWidth: paymentMethod === 'bank' ? 2 : 1,
                            },
                        ]}
                        onPress={() => setPaymentMethod('bank')}
                    >
                        <Ionicons
                            name="business"
                            size={24}
                            color={paymentMethod === 'bank' ? '#4CAF50' : (dark ? '#888' : '#666')}
                        />
                        <Text style={[styles.paymentMethodText, { color: colors.text }]}>
                            Transferencia Bancaria
                        </Text>
                        {paymentMethod === 'bank' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Formulario según método de pago */}
                <View style={[styles.formCard, { backgroundColor: dark ? '#1a1a1a' : '#fff' }]}>
                    {paymentMethod === 'card' && (
                        <>
                            <Text style={[styles.formTitle, { color: colors.text }]}>
                                Datos de la Tarjeta
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                    Número de tarjeta
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                            color: colors.text,
                                            borderColor: dark ? '#333' : '#e0e0e0',
                                        },
                                    ]}
                                    placeholder="1234 5678 9012 3456"
                                    placeholderTextColor={dark ? '#555' : '#999'}
                                    keyboardType="numeric"
                                    value={cardNumber}
                                    onChangeText={formatCardNumber}
                                    maxLength={19}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                    Nombre del titular
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                            color: colors.text,
                                            borderColor: dark ? '#333' : '#e0e0e0',
                                        },
                                    ]}
                                    placeholder="JUAN PEREZ"
                                    placeholderTextColor={dark ? '#555' : '#999'}
                                    value={cardName}
                                    onChangeText={setCardName}
                                    autoCapitalize="characters"
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                                    <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                        Fecha de vencimiento
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                                color: colors.text,
                                                borderColor: dark ? '#333' : '#e0e0e0',
                                            },
                                        ]}
                                        placeholder="MM/AA"
                                        placeholderTextColor={dark ? '#555' : '#999'}
                                        keyboardType="numeric"
                                        value={expiryDate}
                                        onChangeText={formatExpiryDate}
                                        maxLength={5}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                        CVV
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                                color: colors.text,
                                                borderColor: dark ? '#333' : '#e0e0e0',
                                            },
                                        ]}
                                        placeholder="123"
                                        placeholderTextColor={dark ? '#555' : '#999'}
                                        keyboardType="numeric"
                                        value={cvv}
                                        onChangeText={(text) => setCvv(text.substring(0, 3))}
                                        maxLength={3}
                                        secureTextEntry
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {paymentMethod === 'paypal' && (
                        <>
                            <Text style={[styles.formTitle, { color: colors.text }]}>
                                Cuenta PayPal
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                    Email de PayPal
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                            color: colors.text,
                                            borderColor: dark ? '#333' : '#e0e0e0',
                                        },
                                    ]}
                                    placeholder="tu-email@paypal.com"
                                    placeholderTextColor={dark ? '#555' : '#999'}
                                    keyboardType="email-address"
                                    value={paypalEmail}
                                    onChangeText={setPaypalEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={[styles.infoBox, { backgroundColor: dark ? '#0a0a0a' : '#e3f2fd' }]}>
                                <Ionicons name="information-circle" size={20} color="#2196F3" />
                                <Text style={[styles.infoText, { color: dark ? '#aaa' : '#1976D2' }]}>
                                    Serás redirigido a PayPal para completar el pago de forma segura.
                                </Text>
                            </View>
                        </>
                    )}

                    {paymentMethod === 'bank' && (
                        <>
                            <Text style={[styles.formTitle, { color: colors.text }]}>
                                Datos Bancarios
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                    Nombre del banco
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                            color: colors.text,
                                            borderColor: dark ? '#333' : '#e0e0e0',
                                        },
                                    ]}
                                    placeholder="Ej: Banco Atlántida"
                                    placeholderTextColor={dark ? '#555' : '#999'}
                                    value={bankName}
                                    onChangeText={setBankName}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#666' }]}>
                                    Número de cuenta
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: dark ? '#0a0a0a' : '#f5f5f5',
                                            color: colors.text,
                                            borderColor: dark ? '#333' : '#e0e0e0',
                                        },
                                    ]}
                                    placeholder="1234567890"
                                    placeholderTextColor={dark ? '#555' : '#999'}
                                    keyboardType="numeric"
                                    value={bankAccount}
                                    onChangeText={setBankAccount}
                                />
                            </View>

                            <View style={[styles.infoBox, { backgroundColor: dark ? '#0a0a0a' : '#fff3e0' }]}>
                                <Ionicons name="time" size={20} color="#FF9800" />
                                <Text style={[styles.infoText, { color: dark ? '#aaa' : '#F57C00' }]}>
                                    La activación puede tardar de 1 a 3 días hábiles después de la transferencia.
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Información de seguridad */}
                <View style={styles.securityInfo}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                    <Text style={[styles.securityText, { color: dark ? '#aaa' : '#666' }]}>
                        Pago 100% seguro y encriptado
                    </Text>
                </View>

                {/* Botón de pago */}
                <TouchableOpacity
                    style={[styles.payButton, loading && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={styles.payButtonText}>Procesando...</Text>
                    ) : (
                        <>
                            <Ionicons name="lock-closed" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.payButtonText}>
                                Pagar Lps {price.toFixed(2)}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Términos */}
                <Text style={[styles.termsText, { color: dark ? '#888' : '#666' }]}>
                    Al continuar, aceptas nuestros Términos y Condiciones y la Política de Privacidad.
                    La suscripción se renovará automáticamente.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    summaryCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    summaryDetails: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    paymentMethods: {
        gap: 12,
        marginBottom: 24,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    paymentMethodText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    formCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    securityText: {
        fontSize: 14,
        fontWeight: '500',
    },
    payButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    payButtonDisabled: {
        backgroundColor: '#9E9E9E',
        shadowOpacity: 0.1,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    termsText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 16,
    },
});
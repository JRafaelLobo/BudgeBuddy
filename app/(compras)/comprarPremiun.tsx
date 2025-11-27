import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type SubscriptionPlan = 'monthly' | 'annual';

export default function PremiumSubscription() {
    const { colors, dark } = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');

    const plans = {
        monthly: {
            price: 150,
            period: 'mes',
            savings: null,
        },
        annual: {
            price: 1500,
            period: 'año',
            savings: '25% de descuento',
            monthlyEquivalent: 50,
        },
    };

    const features = [
        'Gráficos detallados por categoría',
        'Filtros avanzados (mes, año, todo)',
        'Exportación de reportes en PDF',
        'Análisis de tendencias financieras',
        'Alertas y notificaciones personalizadas',
        'Soporte prioritario 24/7',
        'Sin anuncios',
        'Sincronización en múltiples dispositivos',
    ];

    const handleContinue = () => {
        router.push({
            pathname: '/(compras)/paymet',
            params: {
              plan: 'monthly', // o 'annual'
                price: 99,       // el precio correspondiente
            },
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.crownIcon, { backgroundColor: dark ? '#FFD700' : '#FFC107' }]}>
                        <MaterialIcons name="emoji-events" size={20} color={colors.background} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Desbloquea Premium
                    </Text>
                    <Text style={[styles.subtitle, { color: dark ? '#aaa' : '#666' }]}>
                        Obtén acceso completo a todas las funciones
                    </Text>
                </View>

                {/* Plans */}
                <View style={styles.plansContainer}>
                    {/* Annual Plan */}
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            {
                                backgroundColor: dark ? '#1a1a1a' : '#fff',
                                borderColor: selectedPlan === 'annual' ? '#4CAF50' : (dark ? '#333' : '#e0e0e0'),
                                borderWidth: selectedPlan === 'annual' ? 3 : 1,
                            },
                        ]}
                        onPress={() => setSelectedPlan('annual')}
                    >
                        {plans.annual.savings && (
                            <View style={styles.savingsBadge}>
                                <Text style={styles.savingsText}>{plans.annual.savings}</Text>
                            </View>
                        )}

                        <View style={styles.planHeader}>
                            <View style={styles.radioContainer}>
                                <View style={[
                                    styles.radioOuter,
                                    { borderColor: selectedPlan === 'annual' ? '#4CAF50' : (dark ? '#555' : '#ccc') }
                                ]}>
                                    {selectedPlan === 'annual' && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={[styles.planTitle, { color: colors.text }]}>Plan Anual</Text>
                                <Text style={[styles.planPrice, { color: colors.text }]}>
                                    Lps {plans.annual.price}
                                    <Text style={styles.planPeriod}> /{plans.annual.period}</Text>
                                </Text>
                                {plans.annual.monthlyEquivalent && (
                                    <Text style={[styles.equivalentPrice, { color: dark ? '#888' : '#666' }]}>
                                        Equivale a Lps {plans.annual.monthlyEquivalent.toFixed(2)}/mes
                                    </Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Monthly Plan */}
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            {
                                backgroundColor: dark ? '#1a1a1a' : '#fff',
                                borderColor: selectedPlan === 'monthly' ? '#4CAF50' : (dark ? '#333' : '#e0e0e0'),
                                borderWidth: selectedPlan === 'monthly' ? 3 : 1,
                            },
                        ]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View style={styles.planHeader}>
                            <View style={styles.radioContainer}>
                                <View style={[
                                    styles.radioOuter,
                                    { borderColor: selectedPlan === 'monthly' ? '#4CAF50' : (dark ? '#555' : '#ccc') }
                                ]}>
                                    {selectedPlan === 'monthly' && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={[styles.planTitle, { color: colors.text }]}>Plan Mensual</Text>
                                <Text style={[styles.planPrice, { color: colors.text }]}>
                                    Lps {plans.monthly.price}
                                    <Text style={styles.planPeriod}> /{plans.monthly.period}</Text>
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <Text style={[styles.featuresTitle, { color: colors.text }]}>
                        ¿Qué incluye Premium?
                    </Text>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            <Text style={[styles.featureText, { color: colors.text }]}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.ctaButtonText}>
                        Continuar con {selectedPlan === 'annual' ? 'Plan Anual' : 'Plan Mensual'}
                    </Text>
                </TouchableOpacity>

                {/* Footer */}
                <Text style={[styles.footerText, { color: dark ? '#888' : '#666' }]}>
                    Cancela en cualquier momento. Renovación automática.
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
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    crownIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    plansContainer: {
        gap: 16,
        marginBottom: 32,
    },
    planCard: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    savingsBadge: {
        position: 'absolute',
        top: -10,
        right: 20,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    savingsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioContainer: {
        marginRight: 16,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
    },
    planInfo: {
        flex: 1,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: '700',
    },
    planPeriod: {
        fontSize: 16,
        fontWeight: '400',
    },
    equivalentPrice: {
        fontSize: 14,
        marginTop: 4,
    },
    featuresContainer: {
        marginBottom: 32,
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    featureText: {
        fontSize: 16,
        flex: 1,
    },
    ctaButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 20,
    },
});
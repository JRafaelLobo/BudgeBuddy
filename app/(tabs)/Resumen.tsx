import { Transaction, User } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get('window').width - 32;
const STORAGE_KEY_USER = '@user';

type FilterOption = 'Todo' | 'Mes' | 'Año';

export default function Resumen() {
  const { colors, dark } = useTheme();

  const [profile, setProfile] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterOption>('Todo');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  // 🔹 Carga usuario
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const json = await AsyncStorage.getItem(STORAGE_KEY_USER);
          if (json) setProfile(JSON.parse(json));
        } catch (e) {
          console.error('Error cargando usuario:', e);
        }
      };
      loadUser();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!profile?.id) return;
      const loadTransactions = async () => {
        try {
          const key = `@transactions_${profile.id}`;
          const json = await AsyncStorage.getItem(key);
          setTransactions(json ? JSON.parse(json) : []);
        } catch (e) {
          console.error('Error cargando transacciones:', e);
        }
      };
      loadTransactions();
    }, [profile?.id])
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (filter === 'Mes') return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      if (filter === 'Año') return d.getFullYear() === selectedYear;
      return true;
    });
  }, [transactions, filter, selectedMonth, selectedYear]);

  const balance = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
  }, [filteredTransactions]);

  const categorySummaryExpense = useMemo(() => {
    const summary: Record<string, number> = {};

    filteredTransactions.forEach(t => {
      if (t.type === 'expense') {
        summary[t.category] = (summary[t.category] || 0) + t.amount;
      }
    });

    return summary;
  }, [filteredTransactions]);

  const categorySummaryIncome = useMemo(() => {
    const summary: Record<string, number> = {};

    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        summary[t.category] = (summary[t.category] || 0) + t.amount;
      }
    });

    return summary;
  }, [filteredTransactions]);


  // Gastos → tonos cálidos / alerta
  const COLORSGastos = [
    '#e74c3c', // rojo fuerte
    '#f39c12', // naranja
    '#c0392b', // rojo oscuro
    '#d35400', // naranja oscuro
    '#e67e22', // naranja medio
    '#c0392b', // rojo oscuro
    '#e74c3c', // rojo fuerte
  ];

  // Ingresos → tonos fríos / positivos
  const COLORSIngresos = [
    '#2ecc71', // verde
    '#3498db', // azul
    '#1abc9c', // verde azulado
    '#27ae60', // verde oscuro
    '#2980b9', // azul oscuro
    '#16a085', // verde azulado oscuro
    '#2ecc71', // verde
  ];


  const pieDataExpense = Object.entries(categorySummaryExpense)
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      population: value,
      color: COLORSGastos[index % COLORSGastos.length],
      legendFontColor: dark ? "#fff" : "#000",
      legendFontSize: 14,
    }));
  const pieDataIncome = Object.entries(categorySummaryIncome)
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      population: value,
      color: COLORSIngresos[index % COLORSGastos.length],
      legendFontColor: dark ? "#fff" : "#000",
      legendFontSize: 14,
    }));


  const handleUpgradeToPremium = () => {
    router.push('/(compras)/comprarPremiun');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 🔹 Interfaz premium */}
      {profile?.premium ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
        >
          <Text style={[styles.title, { color: colors.text }]}>Resumen Financiero</Text>

          {/* 🔹 Filtros */}
          <View style={styles.filters}>
            {(['Todo', 'Mes', 'Año'] as FilterOption[]).map(f => (
              <TouchableOpacity key={f} onPress={() => setFilter(f)}>
                <Text
                  style={[
                    styles.filterBtn,
                    { color: filter === f ? colors.primary : colors.text },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filter !== 'Todo' && (
            <Text style={{ color: colors.text, marginBottom: 8 }}>
              {filter === 'Mes' ? `Mes: ${selectedMonth + 1}` : `Año: ${selectedYear}`}
            </Text>
          )}

          {/* 🔹 Balance */}
          <Text style={[styles.balance, { color: colors.text }]}>
            Balance filtrado: Lps {balance.toFixed(2)}
          </Text>

          {/* 🔹 Gráfico */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingresos por categoría</Text>
          {pieDataIncome.length > 0 ? (
            <PieChart
              data={pieDataIncome}
              width={screenWidth}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => dark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 16 }}>
              No hay Ingresos en este período.
            </Text>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Gastos por categoría</Text>
          {pieDataExpense.length > 0 ? (
            <PieChart
              data={pieDataExpense}
              width={screenWidth}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => dark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 16 }}>
              No hay gastos en este período.
            </Text>
          )}


          {/* 🔹 Lista */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Transacciones ({filteredTransactions.length})
          </Text>

          <FlatList
            data={filteredTransactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.txRow, { borderBottomColor: dark ? '#333' : '#eee' }]}>
                <View>
                  <Text style={[styles.txDesc, { color: colors.text }]}>{item.description}</Text>
                  <Text style={[styles.txDate, { color: colors.text }]}>
                    {item.date.slice(0, 10)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: item.type === 'income' ? '#2ecc71' : '#e74c3c' },
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'}Lps {item.amount.toFixed(2)}
                </Text>
              </View>
            )}

          />
        </ScrollView>) : (
        // 🔹 Interfaz No Premium
        <ScrollView >
          <View style={styles.nonPremiumContainer}>

            <View style={styles.lockIconContainer}>
              <View style={[styles.lockCircle, { backgroundColor: dark ? '#2a2a2a' : '#f5f5f5' }]}>
                <Ionicons name="lock-closed" size={60} color="#999" />
              </View>
            </View>

            <Text style={[styles.nonPremiumTitle, { color: colors.text }]}>
              Contenido Premium
            </Text>

            <Text style={[styles.nonPremiumSubtitle, { color: dark ? '#aaa' : '#666' }]}>
              Desbloquea análisis financieros detallados con gráficos avanzados
            </Text>

            <View style={styles.previewFeatures}>
              <View style={styles.previewFeature}>
                <Ionicons name="pie-chart" size={24} color="#4CAF50" />
                <Text style={[styles.previewFeatureText, { color: colors.text }]}>
                  Gráficos por categoría
                </Text>
              </View>
              <View style={styles.previewFeature}>
                <Ionicons name="filter" size={24} color="#4CAF50" />
                <Text style={[styles.previewFeatureText, { color: colors.text }]}>
                  Filtros avanzados
                </Text>
              </View>
              <View style={styles.previewFeature}>
                <Ionicons name="stats-chart" size={24} color="#4CAF50" />
                <Text style={[styles.previewFeatureText, { color: colors.text }]}>
                  Análisis de tendencias
                </Text>
              </View>
              <View style={styles.previewFeature}>
                <Ionicons name="document-text" size={24} color="#4CAF50" />
                <Text style={[styles.previewFeatureText, { color: colors.text }]}>
                  Exportación de reportes
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgradeToPremium}
            >
              <Text style={styles.upgradeButtonText}>Actualizar a Premium</Text>
            </TouchableOpacity>

            <Text style={[styles.fromPrice, { color: dark ? '#888' : '#666' }]}>
              Desde Lps 50/mes
            </Text>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  filterBtn: { fontWeight: '600' },
  balance: { fontSize: 18, marginBottom: 12 },
  sectionTitle: { fontWeight: '600', fontSize: 16, marginTop: 16, marginBottom: 8 },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  txDesc: { fontWeight: '500' },
  txDate: { fontSize: 12 },
  txAmount: { fontWeight: '700' },


  // Estilos No Premium
  nonPremiumContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 0,
    marginBottom: 0,
  },
  lockIconContainer: {
    marginBottom: 24,
  },
  lockCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonPremiumTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  nonPremiumSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  previewFeatures: {
    width: '100%',
    marginBottom: 32,
  },
  previewFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  previewFeatureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  fromPrice: {
    marginTop: 16,
    fontSize: 14,
  },
});
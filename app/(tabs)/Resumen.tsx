import { Transaction, User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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

  const STORAGE_KEY_TRANSACTIONS = `@transactions_${profile?.id || 'und'}`;

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

  // 🔹 Carga transacciones
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

  // 🔹 Filtrado por mes/año
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (filter === 'Mes') return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      if (filter === 'Año') return d.getFullYear() === selectedYear;
      return true;
    });
  }, [transactions, filter, selectedMonth, selectedYear]);

  // 🔹 Balance total
  const balance = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
  }, [filteredTransactions]);

  // 🔹 Agrupar por categoría
  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {
      Comida: 0,
      Transporte: 0,
      Educación: 0,
      Ocio: 0,
      Salud: 0,
      Servicios: 0,
      Otros: 0,
    };

    filteredTransactions.forEach(t => {
      if (t.type === 'expense') summary[t.category] += t.amount;
    });

    return summary;
  }, [filteredTransactions]);

  // 🔹 Datos para PieChart
  const pieData = Object.entries(categorySummary)
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      amount: value,
      color: [
        '#f39c12',
        '#e74c3c',
        '#3498db',
        '#2ecc71',
        '#9b59b6',
        '#1abc9c',
        '#95a5a6',
      ][index % 7],
      legendFontColor: dark ? '#fff' : '#000',
      legendFontSize: 14,
    }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Resumen Financiero</Text>

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

      <Text style={[styles.balance, { color: colors.text }]}>
        Balance filtrado: Lps {balance.toFixed(2)}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Gastos por categoría
      </Text>

      {pieData.length > 0 ? (
        <PieChart
          data={pieData.map(d => ({
            name: d.name,
            population: d.amount,
            color: d.color,
            legendFontColor: d.legendFontColor,
            legendFontSize: d.legendFontSize,
          }))}
          width={screenWidth}
          height={220}
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
              <Text style={[styles.txDate, { color: colors.text }]}>{item.date.slice(0, 10)}</Text>
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
});

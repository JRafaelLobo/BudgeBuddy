import { Transaction, User } from '@/constants/types';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;
const STORAGE_KEY_USER = '@user';
const initialUser: User = {
  id: 'und',
  email: '',
  password: '',
  birthDate: null,
  status: null,
  name: '',
}
export default function FinanceIndex() {
  const { colors, dark } = useTheme();
  const [profile, setProfile] = useState<User>(initialUser);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const json = await AsyncStorage.getItem(STORAGE_KEY_USER);
          if (json) {
            setProfile(JSON.parse(json));
          } else {
            await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(initialUser));
            setProfile(initialUser);
          }
        } catch (e) {
          console.error('Error cargando usuario:', e);
        }
      };
      loadUser();
    }, [])
  );

  // 🔹 Clave dependiente del usuario
  const STORAGE_KEY_TRANSACTIONS = `@transactions_${profile?.id || 'und'}`;
  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar transacción',
      '¿Estás seguro de que deseas eliminar esta transacción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTransactions = transactions.filter(t => t.id !== id);
              setTransactions(updatedTransactions);
              await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updatedTransactions));

              console.log('Transacción eliminada:', id);
            } catch (e) {
              console.error('Error eliminando transacción', e);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (!profile?.id || profile.id === 'und') return; // aún no hay usuario

      const loadTransactions = async () => {
        try {
          const key = `@transactions_${profile.id}`;
          const json = await AsyncStorage.getItem(key);

          if (json) {
            setTransactions(JSON.parse(json));
          } else {
            setTransactions([]);
            await AsyncStorage.setItem(key, JSON.stringify([]));
          }
        } catch (e) {
          console.error('Error cargando transacciones', e);
        }
      };

      loadTransactions();
    }, [profile.id]) // se ejecuta cuando cambia el usuario
  );


  const balance = useMemo(() => {
    return transactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
  }, [transactions]);

  const summaryByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }
    transactions.forEach(t => {
      const key = t.date.slice(0, 10);
      if (map[key] !== undefined)
        map[key] += t.type === 'income' ? t.amount : -t.amount;
    });
    const labels = Object.keys(map).map(k => k.slice(5)); // MM-DD
    const data = Object.values(map);
    return { labels, data };
  }, [transactions]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mis Finanzas</Text>
        <Text style={[styles.balance, { color: colors.text }]}>
          Balance: ${balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.chartWrap}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Actividad (últimos 7 días)
        </Text>
        <LineChart
          data={{ labels: summaryByDay.labels, datasets: [{ data: summaryByDay.data }] }}
          width={screenWidth}
          height={200}
          yAxisLabel="Lps"
          withVerticalLabels={false}
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            propsForDots: { r: '3' },
            color: (opacity = 1) => (dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`),
            labelColor: (opacity = 1) => (dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`),
          }}
          style={{ borderRadius: 8 }}
        />
      </View>

      <View style={styles.listWrap}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Transacciones
        </Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.txRow,
                { borderBottomColor: dark ? '#333' : '#eee' },
              ]}
            >
              {/* Descripción y fecha */}
              <View>
                <Text style={[styles.txDesc, { color: colors.text }]}>
                  {item.category}
                </Text>
                <Text style={[styles.txDesc, { color: colors.text }]}>
                  {item.description}
                </Text>
                <Text style={[styles.txDate, { color: colors.text }]}>
                  {item.date.slice(0, 10)}
                </Text>
              </View>

              {/* Monto y botón de eliminar alineados */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={[
                    styles.txAmount,
                    { color: item.type === 'income' ? '#2ecc71' : '#e74c3c' },
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'}Lps {item.amount.toFixed(2)}
                </Text>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>


      <View style={styles.buttonsRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/add')}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Añadir
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  balance: { fontSize: 18, marginTop: 6 },
  chartWrap: { marginBottom: 12 },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  listWrap: { flex: 1, marginBottom: 12 },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  txDesc: { fontWeight: '500' },
  txDate: { fontSize: 12 },
  txAmount: { fontWeight: '700' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: { fontWeight: '700', textAlign: 'center' },
});

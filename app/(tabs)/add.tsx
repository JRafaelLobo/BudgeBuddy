import { User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

import {
  FlatList,
  Modal,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
const STORAGE_KEY_USER = '@user';

export default function AddTransaction() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [profile, setProfile] = useState<User | null>(null);

  const initialUser: User = {
    id: 'und',
    email: '',
    password: '',
    birthDate: null,
    status: null,
    name: '',
    premium: false
  }

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

  const STORAGE_KEY_TRANSACTIONS = `@transactions_${profile?.id || 'und'}`;

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [category, setCategory] = useState('');
  const [showCombo, setShowCombo] = useState(false);

  // Estados para pagos programados
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [recurrenceCount, setRecurrenceCount] = useState('');

  

   const gastos=[
   'Comida',
   'Transporte',
   'Educación',
   'Ocio',
   'Salud',
   'Servicios',
    'Otros'
   ]

const ingresos=[
   'Mesada',
   'Trabajo',
   'Apoyo Familiar',
   'Becas',
   'Negocios',
   'Inversiones',
   'Otros'
]

  const calculateNextRecurrenceDate = (recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly'): string => {
    const now = new Date();
    const nextDate = new Date(now);
    
    switch (recurrenceType) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    return nextDate.toISOString();
  };

  const handleSave = async () => {
    try {
      const newTransaction: any = {
        id: Date.now().toString(),
        type,
        amount: Number(amount),
        description,
        category,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Agregar información de recurrencia si está activada
      if (isRecurring) {
        newTransaction.isRecurring = true;
        newTransaction.recurrenceType = recurrenceType;
        newTransaction.nextRecurrenceDate = calculateNextRecurrenceDate(recurrenceType);
        if (recurrenceCount && !isNaN(Number(recurrenceCount))) {
          newTransaction.recurrenceCount = Number(recurrenceCount);
        }
      }

      const json = await AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      const currentTransactions = json ? JSON.parse(json) : [];
      const newTransactions = [...currentTransactions, newTransaction];
      await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(newTransactions));
      console.log('Transacción guardada:', newTransaction);
      navigation.goBack();
    } catch (e) {
      console.error('Error guardando transacción', e);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Agregar Transacción</Text>
      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#999"
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Monto"
        placeholderTextColor="#999"
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />


      {/* --- ComboBox de categoría --- */}
      <TouchableOpacity
        style={[styles.input, { borderColor: colors.border }]}
        onPress={() => setShowCombo(true)}
      >
        <Text style={{ color: category ? colors.text : '#999' }}>
          {category || 'Seleccionar categoría'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showCombo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Elige una categoría</Text>
            <FlatList
              data={type === 'income' ? ingresos : gastos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item);
                    setShowCombo(false);
                  }}
                >
                  <Text style={{ color: colors.text }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowCombo(false)} style={styles.closeButton}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              borderColor: type === 'income' ? colors.primary : colors.border,
              backgroundColor: type === 'income' ? colors.primary : 'transparent',
            },
          ]}
          onPress={() => setType('income')}
        >
          <Text style={{ color: type === 'income' ? colors.background : colors.text }}>Ingreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              borderColor: type === 'expense' ? colors.primary : colors.border,
              backgroundColor: type === 'expense' ? colors.primary : 'transparent',
            },
          ]}
          onPress={() => setType('expense')}
        >
          <Text style={{ color: type === 'expense' ? colors.background : colors.text }}>Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Pago Programado */}
      <View style={[styles.recurringSection, { borderColor: colors.border }]}>
        <View style={styles.recurringHeader}>
          <Text style={[styles.recurringLabel, { color: colors.text }]}>Pago Programado</Text>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
          />
        </View>

        {isRecurring && (
          <>
            <TouchableOpacity
              style={[styles.input, { borderColor: colors.border }]}
              onPress={() => setShowRecurrenceModal(true)}
            >
              <Text style={{ color: colors.text }}>
                {recurrenceType === 'daily' && 'Diario'}
                {recurrenceType === 'weekly' && 'Semanal'}
                {recurrenceType === 'monthly' && 'Mensual'}
                {recurrenceType === 'yearly' && 'Anual'}
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Número de repeticiones (dejar vacío para infinito)"
              placeholderTextColor="#999"
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={recurrenceCount}
              onChangeText={setRecurrenceCount}
              keyboardType="numeric"
            />
          </>
        )}
      </View>

      {/* Modal de selección de frecuencia */}
      <Modal visible={showRecurrenceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Frecuencia de repetición</Text>
            <FlatList
              data={[
                { key: 'daily', label: 'Diario' },
                { key: 'weekly', label: 'Semanal' },
                { key: 'monthly', label: 'Mensual' },
                { key: 'yearly', label: 'Anual' },
              ]}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setRecurrenceType(item.key as 'daily' | 'weekly' | 'monthly' | 'yearly');
                    setShowRecurrenceModal(false);
                  }}
                >
                  <Text style={{ color: colors.text }}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowRecurrenceModal(false)} style={styles.closeButton}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: colors.background }]}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 50 },
  title: { fontSize: 25, fontWeight: '700', marginBottom: 24 },
  input: { borderWidth: 1, borderRadius: 8, padding: 20, marginBottom: 12, borderColor: '#ccc' },
  typeRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  typeButton: { borderWidth: 1, borderRadius: 8, padding: 12, width: '40%', alignItems: 'center' },
  saveButton: { padding: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { fontWeight: '700' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: { borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 30, fontWeight: '700', marginBottom: 10 },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  closeButton: { marginTop: 10, alignItems: 'center' },
  recurringSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  recurringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recurringLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

});

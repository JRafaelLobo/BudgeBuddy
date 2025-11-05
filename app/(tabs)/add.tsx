import { User } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

import {
  FlatList,
  Modal,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
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

  const categories = [
    'Alimentación',
    'Transporte',
    'Entretenimiento',
    'Salario',
    'Salud',
    'Educación',
    'Otros',
  ];


  const handleSave = async () => {
    try {
      const newTransaction = {
        id: Date.now().toString(),
        type,
        amount: Number(amount),
        description,
        category,
        date: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
              data={categories}
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
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
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
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  closeButton: { marginTop: 10, alignItems: 'center' },

});

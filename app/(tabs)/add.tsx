import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@transactions';

export default function AddTransaction() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');


  const handleSave = async () => {
    try {
      const newTransaction = {
        id: Date.now().toString(),
        type,
        amount: Number(amount),
        description,
        date: new Date().toISOString(),
      };
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const currentTransactions = json ? JSON.parse(json) : [];
      const newTransactions = [...currentTransactions, newTransaction];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
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
  container: { flex: 1, padding: 20, paddingTop: 50},
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  typeButton: { borderWidth: 1, borderRadius: 8, padding: 12, width: '40%', alignItems: 'center' },
  saveButton: { padding: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaixaDetailsScreen({ route, navigation }) {
  const { box } = route.params;
  const [amount, setAmount] = useState('');

  const handleAddToBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    const balance = await AsyncStorage.getItem('balance');
    const updatedBalance = parseFloat(balance) - parseFloat(amount);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    const newTransaction = {
      amount: parseFloat(amount),
      type: 'subtract',
      source: 'caixa',
      date: new Date().toLocaleString(),
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));

    alert(`Adicionado à caixinha: R$ ${amount}`);
    navigation.goBack();
  };

  const handleWithdrawFromBox = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido.');
      return;
    }

    const balance = await AsyncStorage.getItem('balance');
    const updatedBalance = parseFloat(balance) + parseFloat(amount);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    const newTransaction = {
      amount: parseFloat(amount),
      type: 'add',
      source: 'caixa',
      date: new Date().toLocaleString(),
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));

    alert(`Retirado da caixinha: R$ ${amount}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Caixinha: {box.name}</Text>
      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity onPress={handleAddToBox} style={[styles.actionButton, styles.addButton]}>
        <Text style={styles.actionButtonText}>Adicionar à Caixinha</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleWithdrawFromBox} style={[styles.actionButton, styles.withdrawButton]}>
        <Text style={styles.actionButtonText}>Retirar da Caixinha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#a445bd',
  },
  withdrawButton: {
    backgroundColor: '#a445bd',
  },
});

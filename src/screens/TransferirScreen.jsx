import React, { useState, useEffect } from 'react';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';

import app from '../config/firebase';

const auth = getAuth(app); 

export default function TransferScreen({ navigation }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [balance, setBalance] = useState(0); 


  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1356.00);
        }
      } catch (error) {
        console.error('Erro ao carregar o saldo:', error);
      }
    };

    loadBalance();
  }, []);


  const handleTransfer = async () => {
    const amountValue = parseFloat(amount);
    if (!isNaN(amountValue) && amountValue > 0 && amountValue <= balance && recipient) {
      try {
        const newBalance = balance - amountValue;
        await AsyncStorage.setItem('balance', newBalance.toFixed(2));
        setBalance(newBalance);
        setTransactionStatus('Transferência realizada com sucesso!');
        setAmount('');
        setRecipient('');
      } catch (error) {
        setTransactionStatus('Erro ao atualizar o saldo.');
        console.error('Erro ao salvar o saldo:', error);
      }
    } else {
      setTransactionStatus('Erro: Verifique os dados inseridos ou saldo insuficiente.');
    }
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transferência de Dinheiro</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Destinatário"
          mode="outlined"
          value={recipient}
          onChangeText={setRecipient}
          style={styles.input}
        />
        <TextInput
          label="Valor"
          mode="outlined"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleTransfer} style={styles.button}>
          Realizar Transferência
        </Button>
        {transactionStatus && (
          <Text style={styles.status}>{transactionStatus}</Text>
        )}
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Atual:</Text>
        <Text style={styles.balanceAmount}>R$ {balance.toFixed(2)}</Text>
      </View>
      <View style={styles.bottomActions}>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Voltar
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#a547bf', // Cor alterada
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#a547bf', // Cor alterada
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  balanceContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#a547bf', // Cor alterada
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#444',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomActions: {
    marginTop: 20,
    alignItems: 'center',
  },
});


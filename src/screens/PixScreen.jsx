import React, { useState, useEffect } from 'react';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export default function PixScreen({ navigation }) {
  const [pixAmount, setPixAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [balance, setBalance] = useState(0);
 
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1356.00); // valor padrão inicial
        }
      } catch (error) {
        console.error('Erro ao carregar o saldo:', error);
      }
    };
 
    loadBalance();
  }, []);
 
  // Função para registrar a transação no histórico
  const registerTransaction = async (amount, type) => {
    try {
      const transaction = {
        id: new Date().getTime().toString(), // Gera um ID único
        type,
        amount,
        date: new Date().toLocaleString(),
      };
 
      // Recupera o histórico atual
      const existingTransactions = await AsyncStorage.getItem('transactions');
      let transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
 
      // Adiciona a nova transação
      transactions.push(transaction);
 
      // Salva de volta no AsyncStorage
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
 
    } catch (error) {
      console.error('Erro ao registrar a transação:', error);
    }
  };
 
  const handlePixTransaction = async () => {
    const amountValue = parseFloat(pixAmount);
    if (!isNaN(amountValue) && amountValue > 0) {
      if (amountValue <= balance) {
        try {
          const newBalance = balance - amountValue;
          setTransactionStatus('Pix enviado com sucesso!');
          await registerTransaction(amountValue, 'send');
 
          await AsyncStorage.setItem('balance', newBalance.toFixed(2));
          setBalance(newBalance);
          setPixAmount('');
 
          // Navegar para a tela do banco após a transação
          setTimeout(() => {
            navigation.navigate('BankScreen'); // Volta automaticamente para BankScreen após 1 segundo
          }, 1000);
 
        } catch (error) {
          setTransactionStatus('Erro ao atualizar o saldo.');
          console.error('Erro ao salvar o saldo:', error);
        }
      } else {
        setTransactionStatus('Erro: Saldo insuficiente para enviar.');
      }
    } else {
      setTransactionStatus('Erro: Verifique o valor inserido.');
    }
  };
 
  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pix</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Valor"
          mode="outlined"
          keyboardType="numeric"
          value={pixAmount}
          onChangeText={setPixAmount}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handlePixTransaction}
          style={styles.button}
        >
          Enviar Pix
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
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.bottomButton}
        >
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
      backgroundColor: '#a547bf',
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
    radioGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    radioButton: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 5,
      height: 50,
    },
    radioButtonActive: {
      backgroundColor: '#a547bf',
    },
    radioButtonReceive: {
      backgroundColor: '#a547bf',
      fontColor: '#fff'
    },
    button: {
      marginTop: 10,
      backgroundColor: '#a547bf',
      height: 50,
      borderRadius: 5,
    },
    buttonContent: {
      paddingVertical: 8,
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
      borderColor: '#e0e0e0',
      alignItems: 'center',
    },
    balanceLabel: {
      color: '#444',
      fontSize: 16,
      marginBottom: 5,
    },
    balanceAmount: {
      color: '#a547bf',
      fontSize: 24,
      fontWeight: 'bold',
    },
    bottomActions: {
      marginTop: 20,
      alignItems: 'center',
    },
    bottomButton: {
      backgroundColor: '#a547bf',
    },
  });
 
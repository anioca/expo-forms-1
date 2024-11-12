import React, { useState, useEffect, useCallback } from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function BankScreen({ navigation }) {
  const [balance, setBalance] = useState(1356.00);
  const [transactions, setTransactions] = useState([]); // Armazenar o histórico de transações

  const loadBalance = async () => {
    const storedBalance = await AsyncStorage.getItem('balance');
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions !== null) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de transações:', error);
    }
  };

  const registerTransaction = async (amount, type, boxName, isInitial = false) => {
    try {
      const currentDate = new Date().toLocaleString();
      const transactionDescription =
        type === 'add'
          ? `Guardado na caixinha ${boxName}`
          : `Retirado da caixinha ${boxName}`;

      const newTransaction = {
        amount: parseFloat(amount),
        type,
        description: transactionDescription,
        date: currentDate,
        isInitial, // Marca se é a transação inicial da caixinha
      };

      const storedTransactions = await AsyncStorage.getItem('transactions');
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      transactions.push(newTransaction);

      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBalance();
      loadTransactions();
    }, [])
  );

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={
          item.type === 'add'
            ? item.isInitial
              ? styles.transactionAmountInitial // Cor Amarela para caixinha
              : styles.transactionAmountReceived
            : styles.transactionAmountSent
        }
      >
        {item.type === 'add' ? `+ R$ ${item.amount.toFixed(2)}` : `- R$ ${item.amount.toFixed(2)}`}
      </Text>
    </View>
  );

  const handleCreateBox = async (amount) => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido para a criação da caixinha.');
      return;
    }

    // Adiciona o valor à caixinha e ao saldo
    const updatedBalance = balance - parseFloat(amount); // Retira do saldo
    setBalance(updatedBalance);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    // Registra a transação de criação da caixinha
    await registerTransaction(amount, 'subtract', 'Caixinha', true);

    // Atualiza o histórico de transações com a criação da caixinha
    const newTransaction = {
      amount: parseFloat(amount),
      type: 'subtract',
      description: 'Caixinha criada com valor',
      date: new Date().toLocaleString(),
      isInitial: true, // Marca como transação inicial (criação da caixinha)
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  };

  const handleWithdrawAmount = async (amount) => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido para retirar.');
      return;
    }

    if (balance < parseFloat(amount)) {
      alert('Saldo insuficiente.');
      return;
    }

    // Retira o valor do saldo e registra a transação
    const updatedBalance = balance + parseFloat(amount); // Adiciona ao saldo quando retira
    setBalance(updatedBalance);
    await AsyncStorage.setItem('balance', updatedBalance.toString());

    // Registra a transação de retirar valor da caixinha
    await registerTransaction(amount, 'add', 'Caixinha');

    // Atualiza o histórico de transações
    const newTransaction = {
      amount: parseFloat(amount),
      type: 'add',
      description: 'Valor retirado da caixinha',
      date: new Date().toLocaleString(),
    };

    const storedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.companyName}>UnicForm</Text>
        </View>

        <View style={styles.accountContainer}>
          <Text style={styles.accountLabel}>Conta</Text>
          <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
        </View>

        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            icon="bank-transfer"
            onPress={() => navigation.navigate('PixScreen')}
            style={styles.actionButton}
          >
            Área Pix
          </Button>
          <Button
            mode="contained"
            icon="box"
            onPress={() => navigation.navigate('CaixaScreen')}
            style={styles.actionButton}
          >
            Caixinhas
          </Button>
          <Button
            mode="contained"
            icon="arrow-right-bold"
            onPress={() => navigation.navigate('TransferirScreen')}
            style={styles.actionButton}
          >
            Transferir
          </Button>
        </View>

        <View style={styles.transactionContainer}>
          <Text style={styles.transactionHeader}>Histórico de Transações</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>Nenhuma transação encontrada.</Text>
          ) : (
            <FlatList
              data={[...transactions].reverse()} // Inverte a ordem das transações
              renderItem={renderTransactionItem}
              keyExtractor={(item, index) => index.toString()} // Usa o índice como chave
            />
          )}
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#a547bf',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  companyName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  accountLabel: {
    color: '#444',
    fontSize: 16,
  },
  balance: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#a547bf',
    height: 40,
  },
  transactionContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  transactionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#444',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  transactionDetails: {
    flexDirection: 'column',
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionAmountSent: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  transactionAmountReceived: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: 'bold',
  },
  transactionAmountInitial: {
    fontSize: 16,
    color: '#ffeb3b', // Amarelo para caixinha
    fontWeight: 'bold',
  },
  noTransactionsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
  footerButton: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flex: 1,
    marginHorizontal: 5,
  },
});

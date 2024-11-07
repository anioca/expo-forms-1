import React, { useState, useEffect } from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BankScreen({ navigation }) {
  const [balance, setBalance] = useState(1356.00);
  const [creditCardBalance, setCreditCardBalance] = useState(1094.80);
  const [creditCardLimit, setCreditCardLimit] = useState(730.00);
  const [transactions, setTransactions] = useState([]); // Armazenar o histórico de transações

  useEffect(() => {
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

    loadBalance();
    loadTransactions();
  }, []);

  // Renderizando cada item do histórico
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>{item.type === 'send' ? 'Enviado' : 'Recebido'}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={item.type === 'send' ? styles.transactionAmountSent : styles.transactionAmountReceived}>
        {item.type === 'send' ? `- R$ ${item.amount.toFixed(2)}` : `+ R$ ${item.amount.toFixed(2)}`}
      </Text>
    </View>
  );

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

        {/* Botões de Ação */}
        <View style={styles.actionContainer}>
          <Button mode="contained" icon="bank-transfer" onPress={() => navigation.navigate("PixScreen")} style={styles.actionButton}>
            Área Pix
          </Button>
          <Button mode="contained" icon="barcode" onPress={() => navigation.navigate("ScannerScreen")} style={styles.actionButton}>
            Pagar
          </Button>
          <Button mode="contained" icon="arrow-right-bold" onPress={() => navigation.navigate("TransferirScreen")} style={styles.actionButton}>
            Transferir
          </Button>
        </View>

        {/* Histórico de Transações */}
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionHeader}>Histórico de Transações</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>Nenhuma transação encontrada.</Text>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </ScrollView>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate("EventsScreen")}
          mode="contained"
          style={styles.footerButton}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#a547bf" />
        </Button>

        <Button
          onPress={() => navigation.navigate("HomeScreen")}
          mode="contained"
          style={styles.footerButton}
        >
          <MaterialCommunityIcons name="home" size={24} color="#a547bf" />
        </Button>

        <Button
          onPress={() => navigation.navigate("BankScreen")}
          mode="contained"
          style={styles.footerButton}
        >
          <MaterialCommunityIcons name="bank" size={24} color="#a547bf" />
        </Button>
      </View>
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
    flexDirection: 'column',
    marginVertical: 20,
  },
  actionButton: {
    marginVertical: 3,
    borderRadius: 8,
    backgroundColor: '#a547bf',
  },

  // Estilização do Histórico de Transações
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
    elevation: 3, // Sombra mais suave
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
    color: '#d32f2f', // Vermelho para "enviado"
    fontWeight: 'bold',
  },
  transactionAmountReceived: {
    fontSize: 16,
    color: '#388e3c', // Verde para "recebido"
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

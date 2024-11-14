import React, { useState, useEffect, useCallback } from 'react';
import { Surface, Text,Button } from 'react-native-paper';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function BankScreen({ navigation }) {
  const [balance, setBalance] = useState(1356.00);
  const [transactions, setTransactions] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      loadBalance();
      loadTransactions();
    }, [])
  );

  const renderTransactionItem = ({ item }) => {
    const isBoxTransaction = item.source === 'caixa';
    const amountColor = isBoxTransaction ? '#800080' : item.type === 'add' ? '#388e3c' : '#d32f2f';
    const sign = item.type === 'add' ? '+' : '-';

    return (
      <View style={styles.transactionItem}>
        <View>
          <Text style={styles.transactionText}>{item.source === 'caixa' ? 'Caixinha' : 'Pix'}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {sign} R$ {item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bem vindo</Text>
            <Text style={styles.userName}>Amandha Watanabe</Text>
          </View>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profilePicture}
          />
        </View>

        {/* Saldo Disponível */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
        </View>

        {/* Ações */}
        <View style={styles.actionContainer}>
          {/* Botão de Adicionar Ganho */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('RecberDinheiroScreen')}>
            <MaterialCommunityIcons name="plus-box" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Adicionar Ganho</Text>
          </TouchableOpacity>
          
          {/* Botão de Caixinhas */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CaixaScreen')}>
            <MaterialCommunityIcons name="cash-multiple" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Caixinhas</Text>
          </TouchableOpacity>

          {/* Botão de Transferência */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransferirScreen')}>
            <MaterialCommunityIcons name="arrow-right-bold" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Transferência</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de Transações */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>Nenhuma transação encontrada.</Text>
          ) : (
            <FlatList
              data={[...transactions].reverse()}
              renderItem={renderTransactionItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </ScrollView>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate("EventsScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="calendar" size={24} color="#a547bf" />
        </Button>
        <Button onPress={() => navigation.navigate("HomeScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="home" size={24} color="#a547bf" />
        </Button>
        <Button onPress={() => navigation.navigate("BankScreen")} mode="contained" style={styles.button}>
          <MaterialCommunityIcons name="bank" size={24} color="#a547bf" />
        </Button>
      </View>
    </Surface>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#a767c6',
    padding: 20,
    borderRadius: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  balanceContainer: {
    alignItems: 'center',
    backgroundColor: '#EFEFF0',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#a767c6', // Alterado para roxo #a767c6
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a767c6', // Alterado para roxo #a767c6
    marginTop: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionButton: {
    width: '30%',
    height: 80,
    backgroundColor: '#a767c6', // Alterada para a cor solicitada
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  transactionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  transactionText: {
    fontSize: 14,
    color: '#333333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888888',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  noTransactionsText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',  // Troquei de '#a767c6' para '#fff' para garantir que o fundo seja branco
    borderTopWidth: 1,
    borderColor: '#fff',  // Garantindo que a borda também seja branca
  },
  
  footerButton: {
    alignItems: 'center',
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import { Surface, Text, Button, Modal, TextInput } from 'react-native-paper';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CaixaScreen({ navigation }) {
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [amount, setAmount] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isWithdrawModalVisible, setWithdrawModalVisible] = useState(false);

  const loadBoxes = async () => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      if (storedBoxes !== null) {
        const parsedBoxes = JSON.parse(storedBoxes);
        setBoxes(parsedBoxes);
      } else {
        console.log('Nenhuma caixinha encontrada no AsyncStorage.');
      }
    } catch (error) {
      console.error('Erro ao carregar as caixinhas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBoxes();
    }, [])
  );

  const handleAddAmount = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido para adicionar.');
      return;
    }

    const updatedBoxes = boxes.map((box) =>
      box.id === selectedBox.id
        ? { ...box, amount: box.amount + parseFloat(amount) }
        : box
    );

    setBoxes(updatedBoxes);
    await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

    await updateBalance(parseFloat(amount));
    await registerTransaction(parseFloat(amount), 'add', selectedBox.name);

    setAddModalVisible(false);
    setAmount('');
  };

  const handleWithdrawAmount = async () => {
    if (!amount || isNaN(amount)) {
      alert('Digite um valor válido para retirar.');
      return;
    }

    if (selectedBox.amount < parseFloat(amount)) {
      alert('Saldo insuficiente na caixinha.');
      return;
    }

    const updatedBoxes = boxes.map((box) =>
      box.id === selectedBox.id
        ? { ...box, amount: box.amount - parseFloat(amount) }
        : box
    );

    setBoxes(updatedBoxes);
    await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));

    await updateBalance(-parseFloat(amount));
    await registerTransaction(parseFloat(amount), 'withdraw', selectedBox.name);

    setWithdrawModalVisible(false);
    setAmount('');
  };

  const updateBalance = async (amount) => {
    try {
      const currentBalance = await AsyncStorage.getItem('balance');
      const newBalance = currentBalance ? parseFloat(currentBalance) + amount : amount;
      await AsyncStorage.setItem('balance', newBalance.toString());
    } catch (error) {
      console.error('Erro ao atualizar o saldo:', error);
    }
  };

  const registerTransaction = async (amount, type, boxName) => {
    const transaction = {
      id: Date.now(),
      description:
        type === 'add'
          ? `Guardado na caixinha: ${boxName}`
          : `Retirado da caixinha: ${boxName}`,
      amount,
      date: new Date(),
    };

    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      transactions.push(transaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
    }
  };

  const renderBoxItem = ({ item }) => (
    <TouchableOpacity
      style={styles.boxItem}
      onPress={() => setSelectedBox(item)}
    >
      <Text style={styles.boxName}>{item.name}</Text>
      <Text style={styles.boxAmount}>R$ {item.amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Caixinhas</Text>
        </View>

        {/* Botão para Criar Nova Caixinha */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CriarCaixaScreen')}
          style={styles.createButton}
        >
          Criar Nova Caixinha
        </Button>

        {boxes.length === 0 ? (
          <Text style={styles.noBoxesText}>Nenhuma caixinha encontrada.</Text>
        ) : (
          <FlatList
            data={boxes}
            renderItem={renderBoxItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {selectedBox && (
          <View style={styles.selectedBoxContainer}>
            <Text style={styles.selectedBoxText}>
              {`Caixinha Selecionada: ${selectedBox.name}`}
            </Text>
            <Text style={styles.selectedBoxAmount}>
              {`Saldo: R$ ${selectedBox.amount.toFixed(2)}`}
            </Text>

            <Button mode="contained" onPress={() => setAddModalVisible(true)}>
              Adicionar
            </Button>

            <Button mode="contained" onPress={() => setWithdrawModalVisible(true)}>
              Retirar
            </Button>
          </View>
        )}

        {/* Modal de Adicionar Dinheiro */}
        <Modal visible={isAddModalVisible} onDismiss={() => setAddModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <TextInput
            label="Valor a adicionar"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddAmount}>
            Confirmar
          </Button>
          <Button mode="text" onPress={() => setAddModalVisible(false)}>
            Cancelar
          </Button>
        </Modal>

        {/* Modal de Retirar Dinheiro */}
        <Modal visible={isWithdrawModalVisible} onDismiss={() => setWithdrawModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <TextInput
            label="Valor a retirar"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleWithdrawAmount}>
            Confirmar
          </Button>
          <Button mode="text" onPress={() => setWithdrawModalVisible(false)}>
            Cancelar
          </Button>
        </Modal>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxItem: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
    borderRadius: 10,
  },
  boxName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  boxAmount: {
    fontSize: 16,
    color: 'green',
  },
  noBoxesText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  selectedBoxContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedBoxAmount: {
    fontSize: 18,
    marginVertical: 10,
  },
  createButton: {
    marginVertical: 10,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
  },
  input: {
    marginBottom: 10,
  },
});

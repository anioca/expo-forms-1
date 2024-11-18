import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaixaScreen({ navigation }) {
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null); // Caixinha selecionada
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Carregar as caixinhas do AsyncStorage
  useEffect(() => {
    const loadBoxes = async () => {
      try {
        const storedBoxes = await AsyncStorage.getItem('boxes');
        const parsedBoxes = storedBoxes ? JSON.parse(storedBoxes) : [];
        setBoxes(parsedBoxes); // Atualiza as caixinhas
      } catch (error) {
        console.error('Erro ao carregar caixinhas:', error);
      } finally {
        setLoading(false); // Termina o carregamento
      }
    };

    loadBoxes();
  }, []);

  // Função para adicionar uma nova caixinha
  const addBox = async (newBox) => {
    const updatedBoxes = [...boxes, newBox]; // Adiciona a nova caixinha no final da lista
    setBoxes(updatedBoxes); // Atualiza a lista no estado

    // Salva as caixinhas atualizadas no AsyncStorage
    try {
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));
    } catch (error) {
      console.error('Erro ao salvar caixinha no AsyncStorage:', error);
    }
  };

  // Função para editar uma caixinha existente
  const editBox = async (updatedBox) => {
    const updatedBoxes = boxes.map((box) =>
      box.id === updatedBox.id ? updatedBox : box
    );
    setBoxes(updatedBoxes); // Atualiza o estado com as caixinhas modificadas

    // Salva as caixinhas atualizadas no AsyncStorage
    try {
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));
    } catch (error) {
      console.error('Erro ao editar caixinha no AsyncStorage:', error);
    }
  };

  // Função para navegar até a tela de detalhes da caixinha
  const handleBoxPress = (box) => {
    setSelectedBox(box); // Define a caixinha selecionada
  };

  // Função para renderizar cada item da lista de caixinhas
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBoxPress(item)} style={styles.boxButton}>
      <Text style={styles.boxText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Função para formatar o saldo
  // Função para formatar o saldo
const formatBalance = (balance) => {
  // Se o saldo for undefined ou null, retorna 0
  if (balance === undefined || balance === null) {
    return "0.00";
  }
  return balance.toFixed(2); // Exibe o saldo com duas casas decimais
};

// Exibir os detalhes da caixinha selecionada
{selectedBox && (
  <View style={styles.selectedBoxDetails}>
    <Text style={styles.selectedBoxText}>
      Saldo da Caixinha: R$ {formatBalance(selectedBox.balance)}
    </Text>
    <TouchableOpacity
      onPress={() => navigation.navigate('CaixaDetailsScreen', { box: selectedBox, editBox })}
      style={styles.modifyButton}
    >
      <Text style={styles.modifyButtonText}>Modificar Caixinha</Text>
    </TouchableOpacity>
  </View>
)}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  boxButton: {
    backgroundColor: '#a445bd',
    padding: 30, // Espaçamento maior para dar o efeito de quadrado
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 10, // Espaçamento entre os itens
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Faz com que as caixinhas ocupem a mesma largura
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createBoxButton: {
    backgroundColor: '#a445bd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createBoxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noBoxesText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que os itens 'quebrem' para a linha seguinte
    justifyContent: 'space-between', // Espaço igual entre os itens
  },
  selectedBoxDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modifyButton: {
    backgroundColor: '#a445bd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})};

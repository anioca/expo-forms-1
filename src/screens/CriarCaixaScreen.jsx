import React, { useState } from 'react';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export default function CriarCaixaScreen({ navigation }) {
  const [boxName, setBoxName] = useState('');
  const [boxAmount, setBoxAmount] = useState('');
  const [boxDescription, setBoxDescription] = useState('');
 
  const createBox = async () => {
    if (!boxName || !boxAmount) {
      alert('Preencha todos os campos!');
      return;
    }
 
    const newBox = {
      id: Math.random().toString(),
      name: boxName,
      description: boxDescription,
      amount: parseFloat(boxAmount),
      image: 'https://via.placeholder.com/50', // Pode ser alterado para outra imagem
    };
 
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const updatedBoxes = storedBoxes ? JSON.parse(storedBoxes).concat(newBox) : [newBox];
      await AsyncStorage.setItem('boxes', JSON.stringify(updatedBoxes));
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      console.error('Erro ao salvar a caixinha:', error);
    }
  };
 
  return (
    <Surface style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          label="Nome da Caixinha"
          value={boxName}
          onChangeText={setBoxName}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          value={boxDescription}
          onChangeText={setBoxDescription}
          style={styles.input}
        />
        <TextInput
          label="Valor Inicial (R$)"
          value={boxAmount}
          onChangeText={setBoxAmount}
          keyboardType="numeric"
          style={styles.input}
        />
 
        <Button mode="contained" onPress={createBox} style={styles.createButton}>
          Criar Caixinha
        </Button>
      </KeyboardAvoidingView>
    </Surface>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#6200ee',
    marginTop: 20,
    borderRadius: 8,
  },
});
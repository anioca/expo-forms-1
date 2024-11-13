import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriarCaixaScreen({ navigation }) {
  const [boxName, setBoxName] = useState('');

  const handleCreateBox = async () => {
    if (!boxName) {
      alert('Digite um nome para a caixinha.');
      return;
    }

    const storedBoxes = await AsyncStorage.getItem('boxes');
    const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];

    const newBox = { name: boxName, id: Date.now().toString() };
    boxes.push(newBox);

    await AsyncStorage.setItem('boxes', JSON.stringify(boxes));

    alert(`Caixinha ${boxName} criada com sucesso!`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Caixinha:</Text>
      <TextInput
        style={styles.input}
        value={boxName}
        onChangeText={setBoxName}
      />
      <TouchableOpacity onPress={handleCreateBox} style={styles.createBoxButton}>
        <Text style={styles.createBoxText}>Criar Caixinha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  createBoxButton: {
    backgroundColor: '#a445bd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBoxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

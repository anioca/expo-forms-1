import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaixaScreen({ navigation }) {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const loadBoxes = async () => {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
      setBoxes(boxes);
    };

    loadBoxes();
  }, []);

  const handleBoxPress = (box) => {
    navigation.navigate('CaixaDetailsScreen', { box });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={boxes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBoxPress(item)} style={styles.boxButton}>
            <Text style={styles.boxText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('CriarCaixaScreen')} style={styles.createBoxButton}>
        <Text style={styles.createBoxText}>Criar Caixinha</Text>
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
  boxButton: {
    backgroundColor: '#a445bd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});

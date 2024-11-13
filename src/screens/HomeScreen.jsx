import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Surface, Text, Card, IconButton } from 'react-native-paper';
import { db } from "../config/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  // Função para buscar eventos do Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  // Função para excluir o evento sem confirmação
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o evento.");
    }
  };

  // Função para navegar para a tela de detalhes do evento
  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', {
      event,
      additionalImages: event.additionalImages || [],
    });
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Button
          onPress={() => navigation.navigate("HomeScreen")}
          mode="text"
          style={styles.initialButton}
          labelStyle={styles.initialButtonText}
        >
          Inicial
        </Button>
        <Button
          onPress={() => navigation.navigate("PerfilScreen")}
          mode="contained"
          style={styles.profileButton}
        >
          <MaterialCommunityIcons name="account" size={24} color="#a547bf" />
        </Button>
      </View>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Eventos Imperdíveis</Text>
        </View>
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>Nenhum evento disponível. Adicione novos eventos!</Text>
        ) : (
          events.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <Card.Cover source={{ uri: event.image }} style={styles.cardImage} />
              <Card.Title
                title={event.title}
                subtitle={event.subtitle}
              />
              <Card.Content>
                <Text style={styles.eventDate}>{event.date}</Text>
                {/* Exibindo uma descrição resumida do evento */}
                <Text style={styles.eventDescription}>{event.description.substring(0, 100)}...</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() => handleEventPress(event)}
                  mode="text"
                  labelStyle={{ color: '#a547bf' }}
                >
                  Ver Detalhes
                </Button>
                <Button
                  onPress={() => handleDeleteEvent(event.id)}
                  mode="text"
                  labelStyle={{ color: '#d9534f' }}
                >
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  initialButton: {
    backgroundColor: 'transparent',
  },
  initialButtonText: {
    fontSize: 18,
    color: '#a547bf',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 60,
  },
  subtitleContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a547bf',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    margin: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 6,
    backgroundColor: '#ffffff',
  },
  cardImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
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
  button: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flex: 1,
    marginHorizontal: 5,
  },
});

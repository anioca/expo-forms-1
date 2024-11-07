import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, TextInput, Alert } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { db, auth, storage } from "../config/firebase"; // Ajuste o caminho conforme necessário
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EventsScreen({ navigation }) {
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState([]);

  // Função para selecionar imagem de capa
  const pickCoverImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  // Função para selecionar imagens adicionais
  const pickGalleryImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setGallery([...gallery, result.assets[0].uri]);
  };

  // Função para upload de imagem
  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  // Função para criar o evento
  const handleSubmit = async () => {
    if (!eventName.trim() || !coverImage || !description.trim()) {
      Alert.alert("Erro", "Preencha todos os campos e adicione uma imagem de capa.");
      return;
    }

    try {
      const coverImageUrl = await uploadImage(coverImage, `events/${eventName}/coverImage`);

      // Upload das imagens adicionais
      const galleryUrls = await Promise.all(
        gallery.map((uri, index) => uploadImage(uri, `events/${eventName}/gallery/${index}`))
      );

      // Dados do evento
      const newEvent = {
        title: eventName,
        subtitle: "Novo Evento",
        image: coverImageUrl,
        date: new Date().toLocaleDateString(),
        description,
        icon: "calendar",
        additionalImages: galleryUrls,
      };

      // Adiciona ao Firestore
      await addDoc(collection(db, "events"), newEvent);
      Alert.alert("Sucesso", "Evento criado com sucesso!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro ao salvar o evento no Firestore:", error);
      Alert.alert("Erro", "Não foi possível salvar o evento.");
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Eventos</Text>
        <Button mode="contained" onPress={pickCoverImage} style={styles.imageButton}>
          <Text style={{ color: "#fff" }}>Selecionar Imagem de Capa</Text>
        </Button>
        <View style={styles.coverImageContainer}>
          {coverImage && <Image source={{ uri: coverImage }} style={styles.coverImage} />}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nome do Evento"
          value={eventName}
          onChangeText={setEventName}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Descrição do Evento"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <Button mode="contained" onPress={pickGalleryImage} style={styles.galleryButton}>
          Adicionar Fotos à Galeria
        </Button>
        <View style={styles.galleryContainer}>
          {gallery.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.galleryImage} />
          ))}
        </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Criar Evento
        </Button>
      </ScrollView>

      {/* Footer igual ao da HomeScreen */}
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
    backgroundColor: "#F5F5F5",
  },
  innerContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a547bf",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#a547bf",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    alignItems: "center",
  },
  coverImageContainer: {
    backgroundColor: "#a547bf",
    borderRadius: 8,
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  galleryButton: {
    backgroundColor: "#D8BFD8",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#C0C0C0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
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


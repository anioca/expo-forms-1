import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { Button, Title, Paragraph, IconButton, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { getAuth } from "firebase/auth";

const PerfilScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [aboutText, setAboutText] = useState("");

  // Carregar dados do usuário e "Sobre" sempre que a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUsername(currentUser.displayName || "Nome de usuário");
            setEmail(currentUser.email || "Email não disponível");
          }

          const savedImage = await AsyncStorage.getItem("profileImage");
          if (savedImage) {
            setProfileImage(savedImage);
          }

          const savedPhotos = await AsyncStorage.getItem("recentPhotos");
          if (savedPhotos) {
            setRecentPhotos(JSON.parse(savedPhotos));
          }

          const savedAboutText = await AsyncStorage.getItem("aboutText");
          if (savedAboutText) {
            setAboutText(savedAboutText);
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      };
      loadUserData();
    }, [])
  );

  // Solicitar permissão para acessar a galeria
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para mudar a foto de perfil.");
      }
    };
    requestPermission();
  }, []);

  // Função para escolher a imagem da galeria e salvar no AsyncStorage
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setProfileImage(selectedImageUri);
        await AsyncStorage.setItem("profileImage", selectedImageUri);
      }
    } catch (error) {
      console.error("Erro ao acessar a galeria:", error);
    }
  };

  // Função para adicionar fotos ao Recent Photos
  const addRecentPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newPhotos = result.assets.map(asset => asset.uri);
        const updatedPhotos = [...recentPhotos, ...newPhotos];
        
        // Limite de 5 fotos no "Recent Photos"
        if (updatedPhotos.length > 5) {
          updatedPhotos.splice(0, updatedPhotos.length - 5);
        }

        setRecentPhotos(updatedPhotos);
        await AsyncStorage.setItem("recentPhotos", JSON.stringify(updatedPhotos));
      }
    } catch (error) {
      console.error("Erro ao adicionar fotos recentes:", error);
    }
  };

  // Função para salvar o texto do "Sobre"
  const saveAboutText = async () => {
    try {
      await AsyncStorage.setItem("aboutText", aboutText);
      Alert.alert("Informação salva!", "As informações do 'Sobre' foram atualizadas.");
    } catch (error) {
      console.error("Erro ao salvar o texto do 'Sobre':", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require("../../assets/img/arraia.png")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <Title style={styles.username}>{username}</Title>
        <Paragraph style={styles.bio}>{email}</Paragraph>
      </View>

      <View style={styles.settingsButtonContainer}>
        <IconButton
          icon={() => (
            <MaterialCommunityIcons name="cog" size={24} color="#a547bf" />
          )}
          style={styles.settingsButton}
          onPress={() => navigation.navigate("ConfiguraçãoScreen")}
        />
      </View>

      <Card style={styles.infoSection}>
        <Card.Title title="Sobre" titleStyle={styles.sectionTitle} />
        <Card.Content>
          <TextInput
            style={styles.aboutInput}
            value={aboutText}
            onChangeText={setAboutText}
            placeholder="Escreva algo sobre você"
            multiline
          />
          <Button mode="contained" onPress={saveAboutText} style={styles.saveButton}>
            Salvar
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.gallerySection}>
        <Card.Title title="Recent Photos" titleStyle={styles.sectionTitle} />
        <Card.Content>
          <View style={styles.gallery}>
            {recentPhotos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.galleryImage} />
            ))}
          </View>
          <Button mode="contained" onPress={addRecentPhoto} style={styles.addPhotoButton}>
            Adicionar Fotos
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    borderRadius: 75,
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bio: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#a547bf",
  },
  gallerySection: {
    marginBottom: 20,
  },
  gallery: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 22,
    right: 20,
  },
  settingsButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addPhotoButton: {
    backgroundColor: "#a547bf",
    marginTop: 10,
  },
});

export default PerfilScreen;

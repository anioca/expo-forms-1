import React, { useState } from "react";
import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesome } from 'react-native-vector-icons';
import { auth, db, storage } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState({ email: false, senha: false });

  async function realizaLogin() {
    if (email === "") {
      setErro({ ...erro, email: true });
      return;
    }
    if (senha === "") {
      setErro({ ...erro, senha: true });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      // Verifica se o usuário tem uma foto de perfil no Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (!userDoc.exists()) {
        // Se não tiver, redireciona para a tela de adicionar foto de perfil
        navigation.navigate("AddProfileImageScreen");
      } else {
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      Alert.alert("Erro de Login", "Verifique suas credenciais.");
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o usuário tem uma foto de perfil no Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (!userDoc.exists()) {
        // Se não tiver, redireciona para a tela de adicionar foto de perfil
        navigation.navigate("AddProfileImageScreen");
      } else {
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      Alert.alert("Erro de Login com Google", "Não foi possível logar.");
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.ContainerForm}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Password"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry
          style={styles.input}
          error={erro.senha}
        />
        <Button onPress={realizaLogin} mode="contained" style={styles.button}>
          Proceed
        </Button>

        <Text style={styles.socialText}>Or Log In With</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
        </View>

        <Button onPress={() => navigation.navigate("RegisterScreen")} style={styles.registerButton}>
          Create Account
        </Button>
      </View>
    </View>
  );
}

 
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a767c6', // Cor de fundo principal
  },
  ContainerForm: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#a767c6',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f3f3f3',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#a767c6',
  },
  socialText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#555',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  registerButton: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6a0dad',
  },
});
 
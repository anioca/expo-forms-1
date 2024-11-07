import { View, Image, TouchableOpacity, Alert } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { styles } from "../config/styles";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesome } from 'react-native-vector-icons';
import { auth } from "../config/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [nome, setNome] = useState("");
  const [escola, setEscola] = useState("");
  const [erro, setErro] = useState({
    email: false,
    senha: false,
    repetirSenha: false,
    nome: false,
    escola: false,
  });

  async function realizaRegistro() {
    if (nome === "") {
      setErro({ ...erro, nome: true });
      return;
    }
    if (email === "") {
      setErro({ ...erro, email: true });
      return;
    }
    if (senha === "") {
      setErro({ ...erro, senha: true });
      return;
    }
    if (repetirSenha === "") {
      setErro({ ...erro, repetirSenha: true });
      return;
    }
    if (senha !== repetirSenha) {
      setErro({ ...erro, senha: true, repetirSenha: true });
      return;
    }
    if (escola === "") {
      setErro({ ...erro, escola: true });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro ao registrar:", error.message);
      Alert.alert("Erro de Registro", "Não foi possível realizar o registro. Tente novamente.");
    }
  }

  async function handleGoogleRegister() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário cadastrado com Google:", user);
      navigation.navigate("HomeScreen"); // Navegar para a HomeScreen após o cadastro com Google
    } catch (error) {
      console.error("Erro ao cadastrar com Google:", error.message);
      Alert.alert(
        "Erro de Cadastro com Google",
        "Não foi possível fazer o cadastro com sua conta Google. Você será redirecionado ao login.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"), // Redireciona para a tela de login
          },
        ]
      );
    }
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.ContainerForm1}>
          <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 20, marginTop:40 }}>
            Faça seu Registro
          </Text>
          <TextInput
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            error={erro.nome}
          />
          <TextInput
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            error={erro.email}
          />
          <TextInput
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
            error={erro.senha}
          />
          <TextInput
            placeholder="Repita sua senha"
            value={repetirSenha}
            onChangeText={setRepetirSenha}
            secureTextEntry
            style={styles.input}
            error={erro.repetirSenha}
          />
          <TextInput
            placeholder="Digite sua Escola"
            value={escola}
            onChangeText={setEscola}
            style={styles.input}
            error={erro.escola}
          />
          <View>
         <Button onPress={realizaRegistro} style={{ backgroundColor: "#a547bf", marginTop:30 }} mode="contained">
            Registrar
          </Button>
          </View>
          <View>
         <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
          <FontAwesome name="google" size={24} color="#8a0b07" />
         </TouchableOpacity>
          </View>
          <Button onPress={() => navigation.navigate("LoginScreen")} style={{ marginTop: 20 }}>
            Voltar ao login
          </Button>
        </View>
      </View>
    </Surface>
  );
}
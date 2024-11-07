import { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { styles } from "../config/styles";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesome } from 'react-native-vector-icons';
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState({
    email: false,
    senha: false,
  });

  async function realizaLogin() {
    console.log("Fazer Login");

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
      console.log("Usuário logado:", user);
      navigation.navigate("HomeScreen"); // Navegar para a HomeScreen após o login
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      Alert.alert("Erro de Login", "Não foi possível fazer login. Verifique suas credenciais.");
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado com Google:", user);
      navigation.navigate("HomeScreen"); // Navegar para a HomeScreen após login com Google
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error.message);
      Alert.alert("Erro de Login com Google", "Não foi possível fazer login com sua conta Google.");
    }
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.Containerlogo}>
        {}
        <div>
          <img
            src="assets/img/logo1.png"
            style={{ textAlign: "center" }}
            width={"100%"}
            alt="logo"
          />
        </div>
      </View>

      <View style={styles.ContainerForm}>
        <Text
          variant="headlineMedium"
          style={{ textAlign: "center", marginBottom: 20, marginTop:50  }}
        >
          Login
        </Text>
        <TextInput
          placeholder="Digite seu e-mail"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Digite sua senha"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry
          style={styles.input}
          error={erro.senha}
        />
        <View>
          <Button
            onPress={realizaLogin}
            mode="contained"
            style={{ backgroundColor: "#a547bf" }}
          >
            Fazer Login
          </Button>
        </View>

        <View>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <FontAwesome name="google" size={24} color="#8a0b07" />
      </TouchableOpacity>
        </View>

        <Button
          onPress={() => navigation.navigate("RegisterScreen")}
          style={{ color: "#a547bf", marginTop: 20 }}
        >
          Faça seu cadastro
        </Button>
      </View>
    </Surface>
  );
}
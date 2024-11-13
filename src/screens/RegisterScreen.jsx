import { View, TouchableOpacity, Alert } from "react-native";
import { Button, Surface, Text, TextInput, Checkbox } from "react-native-paper";
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
  const [termosAceitos, setTermosAceitos] = useState(false);  // Estado para o checkbox
 
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
    if (!termosAceitos) {  // Verifica se os termos foram aceitos
      Alert.alert("Atenção", "Você precisa aceitar os termos e condições para continuar.");
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
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro ao cadastrar com Google:", error.message);
      Alert.alert(
        "Erro de Cadastro com Google",
        "Não foi possível fazer o cadastro com sua conta Google. Você será redirecionado ao login.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
    }
  }
 
  return (
    <Surface style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
        </View>
       
        <TextInput
          placeholder="Name"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          error={erro.nome}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Password"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          error={erro.senha}
        />
        <TextInput
          placeholder="Repeat Password"
          value={repetirSenha}
          onChangeText={setRepetirSenha}
          secureTextEntry
          style={styles.input}
          error={erro.repetirSenha}
        />
       
        <View style={styles.termsContainer}>
          <Checkbox
            status={termosAceitos ? "checked" : "unchecked"} // Status do checkbox
            onPress={() => setTermosAceitos(!termosAceitos)}  // Altera o estado ao clicar
          />
          <Text style={styles.termsText}>
            Yes, I agree to the <Text style={{ textDecorationLine: "underline" }} onPress={() => navigation.navigate("TermsScreen")}>Terms & Services</Text>.
          </Text>
        </View>
 
        <Button onPress={realizaRegistro} style={styles.button} mode="contained">
          Proceed
        </Button>
 
        <Text style={{ textAlign: "center", marginTop: 20 }}>Or Sign Up With</Text>
 
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
            <FontAwesome name="google" size={24} color="#8a0b07" />
          </TouchableOpacity>
          {/* Add other social buttons if needed */}
        </View>
 
        <Text style={styles.loginLink}>
          Existing User? <Text style={{ textDecorationLine: "underline" }} onPress={() => navigation.navigate("LoginScreen")}>Log In</Text>
        </Text>
      </View>
    </Surface>
  );
}
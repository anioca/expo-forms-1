import { View, TouchableOpacity, Alert } from "react-native";
import { Button, Surface, Text, TextInput, Checkbox } from "react-native-paper";
import { useState } from "react";
import { styles } from "../config/styles";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesome } from 'react-native-vector-icons';
import { auth, db, storage } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker"; // Adicionando a dependência do ImagePicker

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
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // Estado para imagem de perfil

  // Função para selecionar imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri); // Armazenar URI da imagem no estado
    }
  };

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
    if (!termosAceitos) {
      Alert.alert("Atenção", "Você precisa aceitar os termos e condições para continuar.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Se houver uma imagem de perfil, faz o upload para o Firebase Storage
      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Erro ao fazer upload da imagem:", error);
          },
          async () => {
            // Após o upload, obtenha a URL de download da imagem
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Salvar no Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
              profileImageUrl: downloadURL,
              name: nome,
              email: email,
              school: escola,
            });
          }
        );
      } else {
        // Caso o usuário não tenha enviado imagem, apenas salva os dados
        await setDoc(doc(db, "usuarios", user.uid), {
          name: nome,
          email: email,
          school: escola,
        });
      }

      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Erro ao registrar:", error.message);
      Alert.alert("Erro de Registro", "Não foi possível realizar o registro. Tente novamente.");
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
            status={termosAceitos ? "checked" : "unchecked"}
            onPress={() => setTermosAceitos(!termosAceitos)}
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
          <TouchableOpacity style={styles.googleButton} onPress={pickImage}>
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
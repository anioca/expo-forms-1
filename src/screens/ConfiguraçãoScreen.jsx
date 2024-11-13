import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Title, Card } from "react-native-paper";
import { getAuth, updateEmail, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConfiguraçãoScreen = ({ navigation }) => {
  const auth = getAuth();
  const [username, setUsername] = useState(auth.currentUser?.displayName || "");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [password, setPassword] = useState(""); // Senha atual para reautenticação
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      const savedName = await AsyncStorage.getItem("username");
      if (savedName) setUsername(savedName);
    };
    loadProfileData();
  }, []);

  // Função para enviar o e-mail de verificação
  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert("Verificação enviada", "Por favor, verifique o seu e-mail e tente novamente.");
      } else {
        Alert.alert("Erro", "Usuário não autenticado.");
      }
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        Alert.alert("Erro", "Muitas tentativas de verificação. Por favor, tente novamente mais tarde.");
      } else {
        console.error("Erro ao enviar e-mail de verificação:", error.message);
        Alert.alert("Erro", "Não foi possível enviar o e-mail de verificação. Tente novamente mais tarde.");
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Atualizar o nome no Firebase
      await updateProfile(auth.currentUser, { displayName: username });
      await AsyncStorage.setItem("username", username); // Salvar localmente para exibir no perfil
      Alert.alert("Perfil atualizado com sucesso!");

      // Navegar de volta para o PerfilScreen e atualizar a tela
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error.message); // Log completo do erro
      Alert.alert("Erro ao atualizar o perfil", error.message);
    }
  };

  const handleChangeEmail = async () => {
    if (!password) {
      Alert.alert("Erro", "É necessário informar a senha atual para mudar o email.");
      return;
    }

    // Verificar se o e-mail atual está verificado
    if (!auth.currentUser.emailVerified) {
      // Envia e-mail de verificação se o e-mail atual não está verificado
      sendVerificationEmail();
      return;
    }

    try {
      // Reautenticar o usuário antes de alterar o e-mail
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Atualizar o email no Firebase
      await updateEmail(auth.currentUser, email);
      Alert.alert("Email atualizado com sucesso!");

      // Navegar de volta para o PerfilScreen e atualizar a tela
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao reautenticar ou atualizar o e-mail:", error.message); // Log completo do erro
      Alert.alert("Erro ao atualizar o email", `Código de erro: ${error.code}\n${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erro", "As novas senhas não coincidem!");
      return;
    }

    if (!password) {
      Alert.alert("Erro", "É necessário informar a senha atual para mudar a senha.");
      return;
    }

    try {
      // Reautenticar o usuário antes de alterar a senha
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Atualizar a senha no Firebase
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Senha alterada com sucesso!");

      // Limpar os campos de senha após a atualização
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Erro ao reautenticar ou atualizar a senha:", error); // Log do erro completo
      if (error.code === "auth/wrong-password") {
        Alert.alert("Erro", "Senha atual incorreta.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Erro", "A nova senha é muito fraca. Tente uma senha mais forte.");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Erro de segurança",
          "Por segurança, é necessário fazer login novamente antes de alterar a senha."
        );
        navigation.navigate("LoginScreen"); // Opcional: redireciona o usuário para o login
      } else {
        Alert.alert("Erro ao alterar a senha", `Código de erro: ${error.code}\n${error.message}`);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.header}>Configurações</Title>

      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Atualizar Perfil</Title>
          <TextInput
            label="Nome"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Senha Atual"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            style={styles.buttonPrimary}
            onPress={handleSaveProfile}
          >
            Salvar Perfil
          </Button>
          <Button
            mode="contained"
            style={styles.buttonPrimary}
            onPress={handleChangeEmail}
          >
            Alterar Email
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Alterar Senha</Title>
          <TextInput
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirmar Nova Senha"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            style={styles.buttonPrimary}
            onPress={handleChangePassword}
          >
            Alterar Senha
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#a547bf", // Título "Configurações" roxo
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#a547bf", // Títulos "Atualizar Perfil" e "Alterar Senha" roxos
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  buttonPrimary: {
    backgroundColor: "#a547bf",  // Cor roxa para os botões
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ConfiguraçãoScreen;

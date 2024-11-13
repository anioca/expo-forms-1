import React, { useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
 
export default function TermsScreen({ navigation }) {
  const [termosAceitos, setTermosAceitos] = useState(false);
 
  const handleAceitarTermos = () => {
    if (termosAceitos) {
      navigation.goBack();
    } else {
      Alert.alert("Atenção", "Você precisa aceitar os termos para continuar.");
    }
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Termos de Uso</Text>
       
        <Text style={styles.termsText}>
          Aqui vão os Termos de Uso detalhados... (adicione o conteúdo completo dos termos aqui)
        </Text>
 
        <Text style={styles.termsText}>
          Ao usar este aplicativo, você concorda com os seguintes termos...
        </Text>
       
        <View style={styles.termsContainer}>
          <Checkbox
            status={termosAceitos ? "checked" : "unchecked"}
            onPress={() => setTermosAceitos(!termosAceitos)}
            color="#a767c6"
          />
          <Text style={styles.termsCheckboxText}>
            Eu concordo com os <Text style={styles.linkText}>Termos de Uso</Text>.
          </Text>
        </View>
 
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: termosAceitos ? "#a767c6" : "#ddd" },
          ]}
          onPress={handleAceitarTermos}
          disabled={!termosAceitos}
        >
          <Text
            style={[
              styles.buttonText,
              { color: termosAceitos ? "#ffffff" : "#aaa" },
            ]}
          >
            Aceitar e Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
 
// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a767c6",
    padding: 20,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#a767c6",
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: "#4a4a4a",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsCheckboxText: {
    fontSize: 16,
    color: "#4a4a4a",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#a767c6",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
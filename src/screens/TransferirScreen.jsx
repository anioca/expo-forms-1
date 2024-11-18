import React, { useState, useEffect } from "react";
import { Surface, Text, Button, TextInput } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransferirScreen({ navigation }) {
  const [pixAmount, setPixAmount] = useState("");
  const [description, setDescription] = useState(""); // Novo campo
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem("balance");
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1356.0); // Valor padrão inicial
        }
      } catch (error) {
        console.error("Erro ao carregar o saldo:", error);
      }
    };

    loadBalance();
  }, []);

  const registerTransaction = async (amount, type) => {
    try {
      const transaction = {
        id: new Date().getTime().toString(),
        type,
        amount,
        description, // Adiciona descrição
        date: new Date().toLocaleString(),
      };

      const existingTransactions = await AsyncStorage.getItem("transactions");
      let transactions = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];

      transactions.push(transaction);

      await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Erro ao registrar a transação:", error);
    }
  };

  const handlePixTransaction = async () => {
    const amountValue = parseFloat(pixAmount);
    if (!isNaN(amountValue) && amountValue > 0) {
      if (amountValue <= balance) {
        try {
          const newBalance = balance - amountValue;
          setTransactionStatus("Pix enviado com sucesso!");
          await registerTransaction(amountValue, "send");
          await AsyncStorage.setItem("balance", newBalance.toFixed(2));
          setBalance(newBalance);
          setPixAmount("");
          setDescription(""); // Limpa descrição

          setTimeout(() => {
            navigation.navigate("BankScreen");
          }, 1000);
        } catch (error) {
          setTransactionStatus("Erro ao atualizar o saldo.");
          console.error("Erro ao salvar o saldo:", error);
        }
      } else {
        setTransactionStatus("Erro: Saldo insuficiente para enviar.");
      }
    } else {
      setTransactionStatus("Erro: Verifique o valor inserido.");
    }
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pix</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Valor"
          mode="outlined"
          keyboardType="numeric"
          value={pixAmount}
          onChangeText={setPixAmount}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handlePixTransaction}
          style={styles.button}
        >
          Enviar Pix
        </Button>
        {transactionStatus && (
          <Text style={styles.status}>{transactionStatus}</Text>
        )}
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Atual:</Text>
        <Text style={styles.balanceAmount}>R$ {balance.toFixed(2)}</Text>
      </View>
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.bottomButton}
        >
          Voltar
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#a445bd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  inputContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 10 },
  input: { marginBottom: 15, backgroundColor: "#f5f5f5" },
  button: {
    backgroundColor: "#a445bd",
    height: 50,
    borderRadius: 8,
    marginTop: 15,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
  balanceContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  balanceLabel: { color: "#444", fontSize: 16, marginBottom: 5 },
  balanceAmount: { color: "#a445bd", fontSize: 24, fontWeight: "bold" },
  bottomActions: { marginTop: 20, alignItems: "center" },
  bottomButton: { backgroundColor: "#a445bd", borderRadius: 8, height: 50 },
});

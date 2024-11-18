import React, { useState, useCallback } from "react";
import { Surface, Text, Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { db, auth } from "../config/firebase"; // Import das configurações do Firebase
import { doc, getDoc } from "firebase/firestore";

export default function BankScreen({ navigation }) {
  const [balance, setBalance] = useState(1356.0);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("Usuário");
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://via.placeholder.com/50"
  );
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Estado para a transação selecionada

  // Carregar saldo do AsyncStorage
  const loadBalance = async () => {
    const storedBalance = await AsyncStorage.getItem("balance");
    if (storedBalance !== null) {
      setBalance(parseFloat(storedBalance));
    }
  };

  // Carregar histórico de transações do AsyncStorage
  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem("transactions");
      if (storedTransactions !== null) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de transações:", error);
    }
  };

  // Carregar dados do usuário autenticado no Firestore
  const loadUserData = async () => {
    if (!auth.currentUser) {
      console.error("Usuário não autenticado.");
      return;
    }

    try {
      console.log("Carregando dados do Firestore...");
      const userDoc = doc(db, "usuarios", auth.currentUser.uid); // Documento do usuário no Firestore
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log("Dados carregados do Firestore:", data);
        setUserName(data.displayName || "Usuário");
        setProfileImageUrl(
          data.profileImageUrl || "https://via.placeholder.com/50"
        );
      } else {
        console.error("Documento do usuário não encontrado no Firestore.");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do Firestore:", error);
    }
  };

  // Carregar dados na inicialização da tela
  useFocusEffect(
    useCallback(() => {
      loadBalance();
      loadTransactions();
      loadUserData(); // Carregar dados do Firestore
    }, [])
  );

  // Renderizar cada item da transação
  const renderTransactionItem = ({ item }) => {
    const isBoxTransaction = item.source === "caixa";
    const amountColor = isBoxTransaction
      ? "#800080"
      : item.type === "add"
      ? "#388e3c"
      : "#d32f2f";
    const sign = item.type === "add" ? "+" : "-";

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => setSelectedTransaction(item)} // Exibe a descrição ao clicar na transação
      >
        <View>
          <Text style={styles.transactionText}>
            {item.source === "caixa" ? "Caixinha" : "Pix"}
          </Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {sign} R$ {item.amount.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bem vindo</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profilePicture}
          />
        </View>

        {/* Saldo Disponível */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('RecberDinheiroScreen')}>
            <MaterialCommunityIcons name="plus-box" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Adicionar Ganho</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CaixaScreen')}>
            <MaterialCommunityIcons name="cash-multiple" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Caixinhas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransferirScreen')}>
            <MaterialCommunityIcons name="arrow-right-bold" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Transferência</Text>
          </TouchableOpacity>
        </View>
        {/* Histórico de Transações */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>
              Nenhuma transação encontrada.
            </Text>
          ) : (
            <FlatList
              data={[...transactions].reverse()}
              renderItem={renderTransactionItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>

        {/* Descrição da transação selecionada */}
        {selectedTransaction && (
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDetailsText}>Descrição:</Text>
            <Text style={styles.transactionDetailsContent}>
              {selectedTransaction.description || "Sem descrição"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Rodapé com botões de navegação */}
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollViewContent: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#a767c6",
    padding: 20,
    borderRadius: 15,
  }, balanceLabel: { fontSize: 16, color: '#a767c6' },
  balance: { fontSize: 32, fontWeight: 'bold', color: '#a767c6', marginTop: 10 },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionButton: {
    width: '30%',
    height: 80,
    backgroundColor: '#a767c6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionLabel: { color: '#FFFFFF', fontSize: 12, marginTop: 5, textAlign: 'center' },
  transactionsContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333', marginBottom: 10 },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  welcomeText: { color: "#FFFFFF", fontSize: 14 },
  userName: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  profilePicture: { width: 50, height: 50, borderRadius: 25 },
  balanceContainer: {
    alignItems: "center",
    backgroundColor: "#EFEFF0",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  balanceLabel: { fontSize: 16, color: "#a767c6" },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a767c6",
    marginTop: 10,
  },
  transactionsContainer: { marginTop: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF0",
  },
  transactionText: { fontSize: 14, color: "#333333" },
  transactionDate: { fontSize: 12, color: "#888888" },
  transactionAmount: { fontSize: 14, fontWeight: "bold", color: "#333333" },
  noTransactionsText: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#fff",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    flex: 1,
    marginHorizontal: 5,
  },
  transactionDetails: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 10,
  },
  transactionDetailsText: { fontSize: 16, fontWeight: "bold" },
  transactionDetailsContent: { fontSize: 14, color: "#333" },
});

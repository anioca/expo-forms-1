import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a547bf",
  },
  innerContainer: {
    paddingHorizontal: 20,
    alignSelf: "stretch",
    backgroundColor: "#a547bf",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "#a547bf",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#d9d9d9",
    width: "100%",
    color: "black",
  },
  img: {
    alignItems: "center",
    width: "500%",
    height: 500,
  },
  ContainerForm: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 0,
    width: "100%",
    paddingHorizontal: 60,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  ContainerForm1: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 0,
    width: "100%",
    paddingHorizontal: 80,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  Containerlogo: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    color: "#FFF",
  },
  text: {
    color: "black",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 0,
  },
  centerImage: {
    width: 400, // Ajuste para o tamanho da imagem
    height: 400,
    resizeMode: "contain",
    marginBottom: 0, // Espaço entre a imagem e o botão
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 0, // Espaço entre o título e a imagem
  },
  primaryButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  linkButton: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

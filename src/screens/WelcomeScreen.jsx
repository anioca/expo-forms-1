import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../config/styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <Text style={styles.welcomeTitle}>Let's get started!</Text>
      <Image source={require("../../assets/img/logo1.png")} style={styles.centerImage} />
      <Button
        mode="contained"
        onPress={() => navigation.navigate("RegisterScreen")}
        style={styles.primaryButton}
        labelStyle={styles.buttonText}
      >
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.linkButton}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

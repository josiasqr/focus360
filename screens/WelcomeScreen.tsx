import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/welcome-background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Gradiente superpuesto */}
      <LinearGradient
        colors={["rgba(0,0,0,.90)", "rgba(245, 71, 73, 0.60)"]}
        locations={[0.1, 1.5]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.gradient}
      />

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>focus360</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Permissions")}
        >
          <Text style={styles.buttonText}>Empecemos →</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
          Recupera tu tiempo, redescubre tu vida.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#F54749",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

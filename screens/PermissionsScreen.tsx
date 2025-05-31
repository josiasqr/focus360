import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  AppState,
} from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import { LinearGradient } from "expo-linear-gradient";
import { requireNativeModule } from "expo-modules-core";

// Reemplazo correcto del NativeModule
const ExpoHello = requireNativeModule("ExpoHello");

const { width, height } = Dimensions.get("window");

export default function PermissionsScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);

  const checkUsagePermission = async () => {
    try {
      const isGranted = await ExpoHello.isUsageAccessGranted();
      setHasPermission(isGranted === true);
    } catch (e) {
      console.warn("Error al verificar permiso:", e);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkUsagePermission();
      }
    });

    checkUsagePermission();

    return () => subscription.remove();
  }, []);

  const handlePermissions = () => {
    IntentLauncher.startActivityAsync("android.settings.USAGE_ACCESS_SETTINGS");
  };

  const handleContinue = () => {
    navigation.replace("Drawer");
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/welcome-background.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0.75)", "rgba(245,71,73,0.65)"]}
        locations={[0.35, 1.5]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>focus360</Text>
      </View>

      <View style={styles.overlayBox}>
        <Text style={styles.title}>Permiso necesario</Text>
        <Text style={styles.description}>
          Para continuar, necesitamos que habilites el acceso a tu información
          de uso. Toca el botón abajo, busca{" "}
          <Text style={{ fontWeight: "bold" }}>focus360</Text> en la lista y
          activa los permisos necesarios
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handlePermissions}
        >
          <Text style={styles.buttonText}>Abrir configuración</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, { opacity: hasPermission ? 1 : 0.5 }]}
          disabled={!hasPermission}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Siguiente →</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Recupera tu tiempo, redescubre tu vida.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: height * 0.5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 2.3 }, { translateX: -10 }, { translateY: -55 }],
  },
  gradient: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: height * 0.5,
  },
  header: {
    position: "absolute",
    top: "15%",
    width: "100%",
    alignItems: "center",
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  overlayBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    width: "85%",
    maxWidth: 400,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#F54749",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.6,
    color: "#333",
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F54749",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#F54749",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    alignItems: "center",
    paddingBottom: 50,
  },
  continueButton: {
    backgroundColor: "#F54749",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    width: "70%",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    fontSize: 16,
    color: "#F54749",
    textAlign: "center",
    marginTop: 30,
  },
});

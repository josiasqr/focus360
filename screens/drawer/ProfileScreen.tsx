import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ExpoHello from "../../modules/expo-hello";
import { appIcons } from "../../data/AppIcons"; // ruta en minúsculas
import type { ProfileStackParamList } from "../../navigation/ProfileStack";

const placeholderIcon = require("../../assets/icons/default.png");

export default function ProfileScreen() {
  const [installedApps, setInstalledApps] = useState<any[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const loadInstalledApps = () => {
    ExpoHello.getInstalledApps()
      .then((apps) => setInstalledApps(apps))
      .catch((error) =>
        console.error("Error al obtener las aplicaciones:", error)
      );
  };

  useEffect(() => {
    loadInstalledApps();
  }, []);

  const goToConfig = (app: any) =>
    navigation.navigate("AppConfigScreen", { app }); // ← sin allApps

  const normalizeAppName = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "");

  const renderItem = ({ item }: { item: any }) => {
    const iconKey = normalizeAppName(item.appName);
    const iconSource = appIcons[iconKey] ?? placeholderIcon;

    return (
      <TouchableOpacity style={styles.row} onPress={() => goToConfig(item)}>
        <Image source={iconSource} style={styles.icon} />
        <Text style={styles.appName}>{item.appName}</Text>
        <Text style={styles.chevron}>{">"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {installedApps.length === 0 ? (
        <Text style={styles.empty}>No se encontraron aplicaciones.</Text>
      ) : (
        <FlatList
          data={installedApps}
          keyExtractor={(item) => item.packageName}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={loadInstalledApps}>
        <Text style={styles.buttonText}>Refrescar la lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 6,
  },
  appName: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    fontSize: 18,
    color: "#9e9e9e",
    marginLeft: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e0e0",
  },
  empty: {
    marginTop: 24,
    textAlign: "center",
    color: "#616161",
  },
  button: {
    backgroundColor: "#F54749",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

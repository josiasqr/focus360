import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import ExpoHello from "../../modules/expo-hello";

export default function ProfileScreen() {
  const [installedApps, setInstalledApps] = useState([]);

  const loadInstalledApps = () => {
    ExpoHello.getInstalledApps()
      .then((apps) => {
        setInstalledApps(apps);
      })
      .catch((error) => {
        console.error("Error al obtener las aplicaciones:", error);
      });
  };

  useEffect(() => {
    loadInstalledApps();
  }, []);

  const helloMessage = `${ExpoHello.hello()}`;

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Profile Screen
      </Text>

      <Text>{helloMessage}</Text>

      <Button title="Refrescar uso de apps" onPress={loadInstalledApps} />

      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
        Aplicaciones instaladas:
      </Text>

      <ScrollView style={{ marginTop: 10 }}>
        {installedApps.length === 0 ? (
          <Text>No se encontraron aplicaciones.</Text>
        ) : (
          installedApps.map((app, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text>Nombre: {app.appName}</Text>
              <Text>Paquete: {app.packageName}</Text>
              <Text>Versión: {app.versionName}</Text>
              <Text>Fecha de instalación: {app.firstInstallTime}</Text>
              <Text>Última actualización: {app.lastUpdateTime}</Text>
              <Text>Último uso: {app.lastUsedTime}</Text>
              <Text>Uso diario (últimos 7 días):</Text>
              {app.formattedHoursUsedByDay.map((day, i) => (
                <Text key={i}>• {day}</Text>
              ))}
              <Text>
                Total de uso en los últimos 7 días: {app.formattedTotalUsage}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

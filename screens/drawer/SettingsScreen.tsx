import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function SimpleConfigScreen() {
  const [pushToggle, setPushToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hrs24, setHrs24] = useState(false);

  const Arrow = () => <Text style={styles.arrow}>›</Text>;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.section}>{children}</Text>
  );

  const Row = ({
    label,
    onPress,
    right,
  }: {
    label: string;
    onPress?: () => void;
    right?: React.ReactNode;
  }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      style={styles.row}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      {/* Configuración de notificaciones */}
      <SectionTitle>Configuración de las notificaciones</SectionTitle>
      <Row label="Resumen diario" onPress={() => {}} right={<Arrow />} />
      <Row label="Tono de alerta" onPress={() => {}} right={<Arrow />} />
      <Row label="Vibración" onPress={() => {}} right={<Arrow />} />
      <Row
        label="Notificaciones push"
        right={<Switch value={pushToggle} onValueChange={setPushToggle} />}
      />

      {/* Apariencia */}
      <SectionTitle>Apariencia</SectionTitle>
      <Row
        label="Habilitar modo oscuro"
        right={<Switch value={darkMode} onValueChange={setDarkMode} />}
      />
      <Row
        label="Formato de fecha"
        onPress={() => {}}
        right={<Text style={styles.language}>DD/MM/AA</Text>}
      />
      <Row
        label="Usar formato 24 horas"
        right={<Switch value={hrs24} onValueChange={setHrs24} />}
      />
      <Row
        label="Idioma de la aplicación"
        onPress={() => {}}
        right={<Text style={styles.language}>Español</Text>}
      />

      {/* Datos */}
      <SectionTitle>Datos</SectionTitle>
      <Row label="Restablecer información" onPress={() => {}} />

      {/* Ayúdanos */}
      <SectionTitle>Ayúdanos</SectionTitle>
      <Row label="Enviar comentarios" onPress={() => {}} right={<Arrow />} />
      <Row label="Valorar la app" onPress={() => {}} right={<Arrow />} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  section: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 24,
    marginBottom: 8,
    color: "#F54749",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  rowLabel: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    color: "#999",
  },
  language: {
    fontSize: 16,
    color: "#555",
  },
});

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { ProfileStackParamList } from "../../navigation/ProfileStack";

export default function AppConfigScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ProfileStackParamList, "AppConfigScreen">>();
  const { app } = route.params;

  const key = (suffix: string) => `${app.packageName}:${suffix}`;

  const saveBoolean = async (suffix: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key(suffix), JSON.stringify(value));
    } catch (err) {
      console.error("AsyncStorage error", err);
    }
  };

  const saveString = async (suffix: string, value: string) => {
    try {
      await AsyncStorage.setItem(key(suffix), value);
    } catch (err) {
      console.error("AsyncStorage error", err);
    }
  };

  const loadBoolean = async (suffix: string, def = false) => {
    const v = await AsyncStorage.getItem(key(suffix));
    return v != null ? JSON.parse(v) : def;
  };

  const loadString = async (suffix: string, def = "") => {
    const v = await AsyncStorage.getItem(key(suffix));
    return v ?? def;
  };

  const [autoLock, setAutoLock] = useState(false);
  const [silentNotif, setSilentNotif] = useState(false);
  const [hideLauncher, setHideLauncher] = useState(false);
  const [pauseBg, setPauseBg] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const [al, sn, hl, pb, dl] = await Promise.all([
          loadBoolean("autoLock"),
          loadBoolean("silentNotif"),
          loadBoolean("hideLauncher"),
          loadBoolean("pauseBg"),
          loadString("dailyLimit"),
        ]);
        if (isActive) {
          setAutoLock(al);
          setSilentNotif(sn);
          setHideLauncher(hl);
          setPauseBg(pb);
          setDailyLimit(dl);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleToggle = async (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    suffix: string,
    value: boolean
  ) => {
    setter(value);
    await saveBoolean(suffix, value);
  };

  const handleLimitChange = (text: string) => {
    // Solo números
    const sanitized = text.replace(/[^0-9]/g, "");
    setDailyLimit(sanitized);
  };

  const handleLimitBlur = () => {
    saveString("dailyLimit", dailyLimit);
  };

  return (
    <View style={styles.container}>
      {/* Header custom */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            {"‹ "}
            {app.appName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Configuration options */}
      <View style={styles.body}>
        {/* 1. Bloqueo Automático */}
        <OptionRow
          label={"Bloqueo automático"}
          description="Al activarlo, la aplicación se bloqueará automáticamente tras inactividad."
          value={autoLock}
          onValueChange={(v) => handleToggle(setAutoLock, "autoLock", v)}
        />

        {/* 2. Modo enfoque */}
        <OptionRow
          label="Modo enfoque"
          description="Oculta notificaciones de esta app para mejorar concentración."
          value={silentNotif}
          onValueChange={(v) => handleToggle(setSilentNotif, "silentNotif", v)}
        />

        {/* 3. Alertas inteligentes */}
        <OptionRow
          label="Alertas inteligentes"
          description="Muestra avisos cuando el uso es excesivo según el modelo ML."
          value={hideLauncher}
          onValueChange={(v) =>
            handleToggle(setHideLauncher, "hideLauncher", v)
          }
        />

        {/* 4. Tiempo de descanso forzado */}
        <OptionRow
          label="Tiempo de descanso forzado"
          description="Tiempo de espera obligatorio tras usar demasiado."
          value={pauseBg}
          onValueChange={(v) => handleToggle(setPauseBg, "pauseBg", v)}
        />

        {/* 5. Límite de uso por día */}
        <View style={[styles.row, styles.limitRow]}>
          <View style={styles.textContainer}>
            <Text style={styles.optionLabel}>Límite de uso por día (min)</Text>
            <Text style={styles.optionDesc}>
              Establece un tiempo máximo de uso diario.
            </Text>
          </View>

          <TextInput
            style={styles.limitInput}
            keyboardType="numeric"
            placeholder="0"
            value={dailyLimit}
            onChangeText={handleLimitChange}
            onBlur={handleLimitBlur}
            maxLength={4}
          />
        </View>
      </View>
    </View>
  );
}

type OptionRowProps = {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

function OptionRow({
  label,
  description,
  value,
  onValueChange,
}: OptionRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionDesc}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backText: {
    fontSize: 18,
    fontWeight: "500",
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionDesc: {
    marginTop: 2,
    fontSize: 13,
    color: "#666",
  },
  limitRow: {
    alignItems: "flex-start",
  },
  limitInput: {
    width: 70,
    height: 36,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
    fontSize: 16,
    padding: Platform.OS === "ios" ? 6 : 4,
  },
});

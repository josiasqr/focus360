import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../navigation/DrawerNavigator";

import { appIcons } from "../../data/AppIcons";
import walk from "../../assets/icons/walk-100.png";
import ExpoHello from "../../modules/expo-hello";

// Tipo de navegación
type HomeScreenNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Home"
>;

// Props
type Props = {
  navigation: HomeScreenNavigationProp;
};

// Función para convertir "HH:MM:SS" a minutos
const parseTimeToMinutes = (time: string): number => {
  const [hh = "0", mm = "0", ss = "0"] = time.split(":");
  const hours = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  const seconds = parseInt(ss, 10);
  return hours * 60 + minutes + Math.floor(seconds / 60);
};

// Mostrar el círculo de uso diario
const UsageCircle = ({
  hoursUsed,
  size = 280,
  strokeWidth = 18,
}: {
  hoursUsed: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedHours = Math.min(Math.max(hoursUsed, 0), 24);
  const progress = normalizedHours / 24;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ alignItems: "center", marginBottom: 10 }}>
      <View style={{ position: "relative", width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#DFDCDC"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#F54749"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#F54749" }}>
            {hoursUsed.toFixed(1)} h
          </Text>
          <Text style={{ fontSize: 16, color: "#444", opacity: 0.7 }}>
            uso del dispositivo
          </Text>
        </View>
      </View>
    </View>
  );
};

// Pantalla principal
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [installedApps, setInstalledApps] = useState<any[]>([]);

  useEffect(() => {
    ExpoHello.getInstalledApps()
      .then((apps) => setInstalledApps(apps))
      .catch((err) => console.error("Error al obtener apps:", err));
  }, []);

  const hoursUsed =
    installedApps.reduce(
      (acc, app) =>
        acc + parseTimeToMinutes(app.formattedTotalUsage ?? "00:00:00"),
      0
    ) / 60;

  // Obtener las 2 apps más usadas
  const topApps = [...installedApps]
    .filter((app) => app.appName.toLowerCase() !== "focus360")
    .map((app) => ({
      ...app,
      minutes: parseTimeToMinutes(app.formattedTotalUsage),
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 2);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Actividad diaria",
      headerTitleAlign: "center",
      headerTitleStyle: {
        color: "#F54749",
        fontSize: 25,
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <UsageCircle hoursUsed={hoursUsed} />

      {/* Info de pasos */}
      <View style={styles.locationContainer}>
        <Path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
          fill="#F54749"
          scale={1.4}
        />
        <View style={styles.rowContainer}>
          <Image source={walk} style={{ width: 64, height: 64 }} />
          <View>
            <Text>
              <Text style={styles.kmNumber}>1.2 km</Text>
            </Text>
            <Text style={styles.kmText}>Recorriste el día de hoy</Text>
          </View>
        </View>
      </View>

      {/* Apps más usadas dinámicas */}
      <View style={styles.iconsRow}>
        {topApps.map((app, index) => {
          const iconKey = app.appName.toLowerCase().replace(/\s+/g, "");
          const iconSource = appIcons[iconKey];
          const hours = Math.floor(app.minutes / 60);
          const minutes = app.minutes % 60;
          return (
            <React.Fragment key={index}>
              <View style={styles.appIconContainer}>
                <Image
                  source={iconSource}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={styles.iconText}>
                  <Text style={styles.highlighted}>{app.appName}</Text> es la
                  app más usada con {hours}h {minutes}m
                </Text>
              </View>
              {index === 0 && <View style={styles.separator} />}
            </React.Fragment>
          );
        })}
      </View>

      <Text style={styles.footer}>Últimos 7 días</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver todas las apps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  kmText: {
    fontSize: 16,
    opacity: 0.7,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  kmNumber: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#F54749",
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  appIconContainer: {
    alignItems: "center",
    width: 140,
  },
  iconText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1.2,
    shadowRadius: 2,
  },
  footer: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.7,
    paddingBottom: 20,
  },
  highlighted: {
    fontWeight: "bold",
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

export default HomeScreen;

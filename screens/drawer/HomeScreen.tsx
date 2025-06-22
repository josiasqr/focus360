import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../navigation/DrawerNavigator";

import instagram from "../../assets/icons/instagram-240.png";
import tiktok from "../../assets/icons/tiktok-250.png";
import walk from "../../assets/icons/walk-100.png";

type HomeScreenNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

// Componente UsageCircle para mostrar el uso en horas como barra circular
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
          {/* Círculo de fondo gris claro */}
          <Circle
            stroke="#DFDCDC"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Círculo de progreso naranja */}
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

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // Ejemplo de horas usadas
  const hoursUsed = 20;

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: "Actividad diaria",
      headerTitleAlign: "center",
      headerTitleStyle: {
        color: "#F54749", // Cambia el color del título
        fontSize: 25,
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <UsageCircle hoursUsed={hoursUsed} />

      {/* Ubicación y texto */}
      <View style={styles.locationContainer}>
        <Path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
          fill="#F54749"
          scale={1.4}
        />
        <View style={styles.rowContainer}>
          {/* Ícono alineado a la izquierda */}
          <Image source={walk} style={{ width: 64, height: 64 }} />

          {/* Bloque de textos alineados verticalmente */}
          <View>
            <Text>
              <Text style={styles.kmNumber}>1.2 km</Text>
            </Text>
            <Text style={styles.kmText}>Recorriste el día de hoy</Text>
          </View>
        </View>
      </View>

      {/* Iconos de apps más usadas */}
      <View style={styles.iconsRow}>
        {/* TikTok */}
        <View style={styles.appIconContainer}>
          <Image source={tiktok} style={{ width: 100, height: 100 }} />
          <Text style={styles.iconText}>
            <Text style={styles.highlighted}>TikTok</Text> es la app más usada
            con 27 horas y 30 minutos
          </Text>
        </View>
        {/* Separador */}

        <View style={styles.separator} />

        {/* Instagram */}
        <View style={styles.appIconContainer}>
          <Image source={instagram} style={{ width: 100, height: 100 }} />
          <Text style={styles.iconText}>
            <Text style={styles.highlighted}>Instagram</Text> es la app más
            usada con 21 horas y 30 minutos
          </Text>
        </View>
      </View>

      {/* Últimos 7 días */}
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

import React from "react";
import { View, Text, Button } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../navigation/DrawerNavigator";

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
  size = 150,
  strokeWidth = 15,
}: {
  hoursUsed: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Normalizar entre 0 y 24, luego calcular el porcentaje
  const normalizedHours = Math.min(Math.max(hoursUsed, 0), 24);
  const progress = normalizedHours / 24;

  // Longitud de la parte del círculo que estará coloreada
  const strokeDashoffset = circumference * (1 - progress);

  return (
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
      {/* Texto en el centro */}
      <Text
        style={{
          position: "absolute",
          alignSelf: "center",
          top: size / 2 - 10,
          fontSize: 20,
          fontWeight: "bold",
          color: "#F54749",
        }}
      >
        {hoursUsed.toFixed(1)} h
      </Text>
    </Svg>
  );
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // Ejemplo de horas usadas
  const hoursUsed = 20;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20, fontSize: 22, fontWeight: "bold" }}>
        Home Screen
      </Text>

      <UsageCircle hoursUsed={hoursUsed} />

      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
};

export default HomeScreen;

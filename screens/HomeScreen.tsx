import React from "react";
import { View, Text, Button } from "react-native";

// Importar el tipo de navegación desde react-navigation
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/DrawerNavigator"; // Suponiendo que lo definas allí
import { StatusBar } from "expo-status-bar";

// Definir el tipo de los props
type HomeScreenNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar style="auto" />
      <Text>Home Screen</Text>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
};

export default HomeScreen;

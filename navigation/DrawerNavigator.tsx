import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "../screens/drawer/HomeScreen";
import ProfileStack from "./ProfileStack"; // ⟵ usa el stack
import SettingsScreen from "../screens/drawer/SettingsScreen";

export type RootDrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function DrawerNavigator() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#F54749" translucent={false} />
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Hoy" }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileStack}
          options={{ title: "Aplicaciones" }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Configuración" }}
        />
      </Drawer.Navigator>
    </>
  );
}

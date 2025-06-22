import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "../screens/drawer/HomeScreen";
import ProfileScreen from "../screens/drawer/ProfileScreen";

export type RootDrawerParamList = {
  Home: undefined;
  Profile: undefined;
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
          component={ProfileScreen}
          options={{ title: "Configuración" }}
        />
      </Drawer.Navigator>
    </>
  );
}

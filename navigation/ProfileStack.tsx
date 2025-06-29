import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/drawer/ProfileScreen";
import AppConfigScreen from "../screens/drawer/AppConfigScreen";

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  AppConfigScreen: { app: any };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AppConfigScreen" component={AppConfigScreen} />
    </Stack.Navigator>
  );
}

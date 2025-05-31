// App.tsx
import React from "react";
import MainNavigator from "./navigation/MainNavigator";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <MainNavigator />
    </>
  );
}

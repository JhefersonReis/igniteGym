import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { StatusBar } from "react-native";
import { NativeBaseProvider } from 'native-base';

import { Loading } from "./src/components/Loading";
import { theme } from "./src/theme";

import { Routes } from "@routes/index";

import { AuthContextProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={theme} >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes/> : <Loading/>}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

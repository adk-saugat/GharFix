import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "GharFix", headerShown: false }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ title: "Login", headerShown: false }}
        />
      </Stack>
    </>
  );
}

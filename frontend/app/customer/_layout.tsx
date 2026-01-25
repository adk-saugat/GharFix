import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const CustomerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CustomerLayout;

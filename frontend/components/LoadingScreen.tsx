import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { BackHeader } from "./BackHeader";

type LoadingScreenProps = {
  onBack: () => void;
  message?: string;
};

export function LoadingScreen({ onBack, message = "Loading..." }: LoadingScreenProps) {
  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader onBack={onBack} variant="bar" />
      <View className="flex-1 justify-center items-center px-6">
        <ActivityIndicator size="large" />
        <Text className="text-gray-600 mt-3">{message}</Text>
      </View>
    </View>
  );
}

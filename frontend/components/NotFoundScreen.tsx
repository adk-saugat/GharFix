import React from "react";
import { View, Text } from "react-native";
import { BackHeader } from "./BackHeader";
import { PrimaryButton } from "./PrimaryButton";

type NotFoundScreenProps = {
  onBack: () => void;
  message?: string;
  backLabel?: string;
};

export function NotFoundScreen({
  onBack,
  message = "Not found",
  backLabel = "Back",
}: NotFoundScreenProps) {
  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader onBack={onBack} variant="bar" />
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-gray-600 text-center mb-4">{message}</Text>
        <PrimaryButton onPress={onBack} size="sm">
          {backLabel}
        </PrimaryButton>
      </View>
    </View>
  );
}

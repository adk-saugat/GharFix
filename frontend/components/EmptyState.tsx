import React from "react";
import { View, Text } from "react-native";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <View className={`py-8 ${className}`}>
      <Text className="text-gray-500 text-center">{message}</Text>
    </View>
  );
}

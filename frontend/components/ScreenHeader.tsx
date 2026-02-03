import React from "react";
import { View, Text } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function ScreenHeader({
  title,
  subtitle,
  className = "",
}: ScreenHeaderProps) {
  return (
    <View className={`px-6 pt-24 pb-4 ${className}`}>
      <Text className="text-4xl font-bold text-black">{title}</Text>
      {subtitle ? (
        <Text className="text-lg text-gray-600 mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}

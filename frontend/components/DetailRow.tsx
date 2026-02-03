import React from "react";
import { View, Text } from "react-native";

type DetailRowProps = {
  label: string;
  value: string | number;
  last?: boolean;
};

export function DetailRow({ label, value, last }: DetailRowProps) {
  return (
    <View className={`px-4 py-4 ${last ? "" : "border-b border-gray-300"}`}>
      <Text className="text-sm text-gray-500 mb-1">{label}</Text>
      <Text className="text-lg text-black">{value}</Text>
    </View>
  );
}

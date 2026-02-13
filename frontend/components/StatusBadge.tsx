import React from "react";
import { View, Text } from "react-native";

/** Maps status to tailwind badge styles */
function getStatusStyle(status: string): { bg: string; text: string } {
  if (status === "accepted") return { bg: "bg-green-100", text: "text-green-800" };
  if (status === "rejected") return { bg: "bg-gray-100", text: "text-gray-600" };
  return { bg: "bg-blue-100", text: "text-blue-800" };
}

type StatusBadgeProps = {
  status: string;
  label: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = getStatusStyle(status);
  return (
    <View className={`px-3 py-1 rounded ${style.bg}`}>
      <Text className={`text-sm font-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}

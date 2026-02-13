import React from "react";
import { View, Text } from "react-native";
import { Card } from "./Card";

type ActivityItemProps = {
  title: string;
  date: string;
  /** Tailwind color for the dot, e.g. "bg-blue-500" */
  dotColor?: string;
};

export function ActivityItem({
  title,
  date,
  dotColor = "bg-gray-400",
}: ActivityItemProps) {
  return (
    <Card className="mb-3 p-4 border-gray-200 bg-white">
      <View className="flex-row items-start gap-2">
        <View className={`w-2 h-2 rounded-full ${dotColor} mt-1.5`} />
        <View className="flex-1">
          <Text className="text-sm font-medium text-black">{title}</Text>
          <Text className="text-xs text-gray-500 mt-0.5">{date}</Text>
        </View>
      </View>
    </Card>
  );
}

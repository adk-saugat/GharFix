import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { JobItem } from "@/api/customer";
import { categoryLabel } from "@/constants/categories";
import { Card } from "@/components/Card";

type CustomerJobCardProps = {
  job: JobItem;
  onPress: () => void;
  className?: string;
};

export function CustomerJobCard({ job, onPress, className = "" }: CustomerJobCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card className={className}>
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-xl font-semibold text-black flex-1">
            {job.title}
          </Text>
          <View className="bg-blue-100 px-3 py-1 rounded">
            <Text className="text-blue-800 text-sm font-semibold">
              {categoryLabel(job.status || "open")}
            </Text>
          </View>
        </View>
        <Text className="text-base text-gray-600 mb-1">
          Category: {categoryLabel(job.category ?? "")}
        </Text>
        <View className="flex-row justify-end w-full mt-2">
          <Text className="text-base font-semibold text-gray-500">
            View applications →
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

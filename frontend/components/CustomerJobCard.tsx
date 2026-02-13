import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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
      <Card className={`p-4 border-gray-200 bg-white ${className}`}>
        <View className="flex-row justify-between items-center gap-2 mb-3">
          <View className="flex-row items-center gap-2 flex-1 flex-wrap">
            <Text className="text-lg font-semibold text-black" numberOfLines={1}>
              {job.title}
            </Text>
            <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
              <Text className="text-sm font-medium text-gray-700">
                {categoryLabel(job.category ?? "")}
              </Text>
            </View>
          </View>
          <View className="bg-blue-100 px-2.5 py-1 rounded-lg">
            <Text className="text-blue-800 text-sm font-semibold">
              {categoryLabel(job.status || "open")}
            </Text>
          </View>
        </View>
        {job.address ? (
          <View className="flex-row items-start mb-3">
            <Ionicons name="location-outline" size={16} color="#6B7280" style={{ marginTop: 2 }} />
            <Text className="text-sm text-gray-600 ml-2 flex-1" numberOfLines={2}>
              {job.address}
            </Text>
          </View>
        ) : null}
        <View className="flex-row justify-end">
          <Text className="text-sm font-semibold text-gray-500">View applications →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

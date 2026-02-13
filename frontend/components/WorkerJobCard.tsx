import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { JobItem } from "@/api/worker";
import { categoryLabel } from "@/constants/categories";
import { Card } from "./Card";

type WorkerJobCardProps = {
  job: JobItem;
  onPress: () => void;
  className?: string;
};

export function WorkerJobCard({ job, onPress, className = "" }: WorkerJobCardProps) {
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
              {categoryLabel(job.status || "New")}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mb-1.5">
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2 flex-1" numberOfLines={1}>
            {job.username}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-2">
          {job.address ? (
            <View className="flex-row items-start flex-1 min-w-0">
              <Ionicons name="location-outline" size={16} color="#6B7280" style={{ marginTop: 2 }} />
              <Text className="text-sm text-gray-600 ml-2 flex-1" numberOfLines={2}>
                {job.address}
              </Text>
            </View>
          ) : (
            <View className="flex-1" />
          )}
          <Text className="text-sm font-semibold text-gray-500 shrink-0">View details →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

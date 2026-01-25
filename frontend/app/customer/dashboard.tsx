import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-24 pb-4">
        <Text className="text-4xl font-bold text-black">Dashboard</Text>
        <Text className="text-lg text-gray-600 mt-1">Welcome back!</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          {/* Request Service Button */}
          <TouchableOpacity className="bg-black py-4 px-6 rounded-lg mb-6">
            <Text className="text-white text-xl font-semibold text-center">
              Request Service
            </Text>
          </TouchableOpacity>

          {/* Active Jobs */}
          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <View className="border border-gray-300 rounded-lg p-4 mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Plumbing Repair
              </Text>
              <View className="bg-yellow-100 px-3 py-1 rounded">
                <Text className="text-yellow-800 text-sm font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Worker: John Smith
            </Text>
            <Text className="text-base text-gray-600">Date: Jan 24, 2026</Text>
          </View>

          <View className="border border-gray-300 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Electrical Work
              </Text>
              <View className="bg-green-100 px-3 py-1 rounded">
                <Text className="text-green-800 text-sm font-semibold">
                  Scheduled
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Worker: Sarah Johnson
            </Text>
            <Text className="text-base text-gray-600">Date: Jan 26, 2026</Text>
          </View>

          {/* Past Jobs */}
          <Text className="text-2xl font-bold text-black mb-3">Past Jobs</Text>

          <View className="border border-gray-300 rounded-lg p-4 mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Carpentry
              </Text>
              <View className="bg-gray-100 px-3 py-1 rounded">
                <Text className="text-gray-800 text-sm font-semibold">
                  Completed
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Worker: Mike Davis
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Date: Jan 20, 2026
            </Text>
            <Text className="text-base text-gray-600">Paid: $150.00</Text>
          </View>

          <View className="border border-gray-300 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">Painting</Text>
              <View className="bg-gray-100 px-3 py-1 rounded">
                <Text className="text-gray-800 text-sm font-semibold">
                  Completed
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Worker: Lisa Chen
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Date: Jan 15, 2026
            </Text>
            <Text className="text-base text-gray-600">Paid: $200.00</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

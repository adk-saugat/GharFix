import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function CustomerDashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Dashboard" subtitle="Welcome back!" />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          <PrimaryButton
            onPress={() => router.push("/customer/requestService")}
            className="mb-6 px-6"
          >
            Request Service
          </PrimaryButton>

          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <Card className="mb-3">
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
          </Card>

          <Card className="mb-6">
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
          </Card>

          <Text className="text-2xl font-bold text-black mb-3">Past Jobs</Text>

          <Card className="mb-3">
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
          </Card>

          <Card className="mb-6">
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
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

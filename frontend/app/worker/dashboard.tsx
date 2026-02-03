import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";

export default function WorkerDashboard() {
  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Dashboard" subtitle="Welcome back!" />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          <Card className="p-5 mb-6">
            <Text className="text-base text-gray-500 mb-1">Total Earnings</Text>
            <Text className="text-4xl font-bold text-black">$1,240</Text>
            <Text className="text-sm text-gray-500 mt-1">This month</Text>
          </Card>

          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">3</Text>
              <Text className="text-sm text-gray-600 mt-1">Active</Text>
            </Card>
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">12</Text>
              <Text className="text-sm text-gray-600 mt-1">Completed</Text>
            </Card>
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">4.8</Text>
              <Text className="text-sm text-gray-600 mt-1">Rating</Text>
            </Card>
          </View>

          <Text className="text-2xl font-bold text-black mb-3">
            New Requests
          </Text>

          <Card className="mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Fix Kitchen Sink
              </Text>
              <View className="bg-blue-100 px-3 py-1 rounded">
                <Text className="text-blue-800 text-sm font-semibold">New</Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Category: Plumbing
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Sarah Johnson
            </Text>
            <Text className="text-base text-gray-600 mb-3">
              Address: 45 Oak Ave, Euless, TX
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-black py-2 rounded-lg">
                <Text className="text-white text-base font-semibold text-center">
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-gray-400 py-2 rounded-lg">
                <Text className="text-black text-base font-semibold text-center">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card className="mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Repaint Living Room
              </Text>
              <View className="bg-blue-100 px-3 py-1 rounded">
                <Text className="text-blue-800 text-sm font-semibold">New</Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Category: Painting
            </Text>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Mike Davis
            </Text>
            <Text className="text-base text-gray-600 mb-3">
              Address: 12 Pine Rd, Euless, TX
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-black py-2 rounded-lg">
                <Text className="text-white text-base font-semibold text-center">
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-gray-400 py-2 rounded-lg">
                <Text className="text-black text-base font-semibold text-center">
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <Card className="mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Electrical Wiring
              </Text>
              <View className="bg-yellow-100 px-3 py-1 rounded">
                <Text className="text-yellow-800 text-sm font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Lisa Chen
            </Text>
            <Text className="text-base text-gray-600">
              Address: 78 Elm St, Euless, TX
            </Text>
          </Card>

          <Card className="mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Deck Repair
              </Text>
              <View className="bg-yellow-100 px-3 py-1 rounded">
                <Text className="text-yellow-800 text-sm font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Tom Wilson
            </Text>
            <Text className="text-base text-gray-600">
              Address: 9 Maple Lane, Euless, TX
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

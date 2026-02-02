import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function WorkerDashboard() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-24 pb-4">
        <Text className="text-4xl font-bold text-black">Dashboard</Text>
        <Text className="text-lg text-gray-600 mt-1">Welcome back!</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          {/* Earnings Summary */}
          <View className="border border-gray-300 rounded-lg p-5 mb-6">
            <Text className="text-base text-gray-500 mb-1">Total Earnings</Text>
            <Text className="text-4xl font-bold text-black">$1,240</Text>
            <Text className="text-sm text-gray-500 mt-1">This month</Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 border border-gray-300 rounded-lg p-4 items-center">
              <Text className="text-3xl font-bold text-black">3</Text>
              <Text className="text-sm text-gray-600 mt-1">Active</Text>
            </View>
            <View className="flex-1 border border-gray-300 rounded-lg p-4 items-center">
              <Text className="text-3xl font-bold text-black">12</Text>
              <Text className="text-sm text-gray-600 mt-1">Completed</Text>
            </View>
            <View className="flex-1 border border-gray-300 rounded-lg p-4 items-center">
              <Text className="text-3xl font-bold text-black">4.8</Text>
              <Text className="text-sm text-gray-600 mt-1">Rating</Text>
            </View>
          </View>

          {/* New Requests */}
          <Text className="text-2xl font-bold text-black mb-3">
            New Requests
          </Text>

          <View className="border border-gray-300 rounded-lg p-4 mb-3">
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
          </View>

          <View className="border border-gray-300 rounded-lg p-4 mb-6">
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
          </View>

          {/* Active Jobs */}
          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <View className="border border-gray-300 rounded-lg p-4 mb-3">
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
          </View>

          <View className="border border-gray-300 rounded-lg p-4 mb-6">
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

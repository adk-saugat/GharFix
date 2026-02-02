import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function CustomerProfile() {
  const router = useRouter();

  // Placeholder - replace with actual user data
  const user = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    username: "johndoe",
    email: "johndoe@email.com",
    phone: "+1 234 567 8900",
    role: "customer",
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-24 pb-4">
        <Text className="text-4xl font-bold text-black">Profile</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center border-2 border-gray-300">
              <Text className="text-4xl text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-black mt-3">
              {user.username}
            </Text>
            <Text className="text-base text-gray-500 mt-1 capitalize">
              {user.role}
            </Text>
          </View>

          {/* Info Section */}
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Account Details
          </Text>

          <View className="border border-gray-300 rounded-lg overflow-hidden mb-6">
            {/* Username */}
            <View className="px-4 py-4 border-b border-gray-300">
              <Text className="text-sm text-gray-500 mb-1">Username</Text>
              <Text className="text-lg text-black">{user.username}</Text>
            </View>

            {/* Email */}
            <View className="px-4 py-4 border-b border-gray-300">
              <Text className="text-sm text-gray-500 mb-1">Email</Text>
              <Text className="text-lg text-black">{user.email}</Text>
            </View>

            {/* Phone */}
            <View className="px-4 py-4 border-b border-gray-300">
              <Text className="text-sm text-gray-500 mb-1">Phone</Text>
              <Text className="text-lg text-black">
                {user.phone || "Not provided"}
              </Text>
            </View>

            {/* Role */}
            <View className="px-4 py-4">
              <Text className="text-sm text-gray-500 mb-1">Role</Text>
              <Text className="text-lg text-black capitalize">{user.role}</Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="bg-black py-4 rounded-lg w-full"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

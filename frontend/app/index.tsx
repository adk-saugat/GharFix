import React from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { routes } from "@/utils/routes";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function Home() {
  const router = useRouter();
  const { isChecking } = useRedirectIfAuthenticated();

  if (isChecking) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6 pt-12">
        <View className="w-full max-w-md mx-auto">
          <View className="items-center mb-12">
            <Text className="text-5xl font-bold text-black mb-2">Gharfix</Text>
            <Text className="text-lg text-gray-500 text-center mb-3">
              Fixing homes, locally
            </Text>
            <Text className="text-base text-gray-400 text-center leading-6 max-w-xs">
              Request home repairs or list your skills as a local service
              provider. Simple and secure.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-500 mb-4">Get started</Text>
            <TouchableOpacity
              onPress={() => router.push(routes.login)}
              className="bg-black py-4 rounded-xl mb-3"
              activeOpacity={0.85}
            >
              <Text className="text-white text-base font-semibold text-center">Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(routes.register)}
              className="border-2 border-gray-300 py-4 rounded-xl bg-white"
              activeOpacity={0.85}
            >
              <Text className="text-black text-base font-semibold text-center">Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="py-6 items-center">
        <Text className="text-sm text-gray-400">© 2025 Gharfix. All rights reserved.</Text>
      </View>
    </View>
  );
}

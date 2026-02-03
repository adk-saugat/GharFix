import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getUser, clearAuth } from "@/api/storage";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { DetailRow } from "@/components/DetailRow";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function CustomerProfile() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((u) => {
      setUser(u ?? null);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    await clearAuth();
    router.replace("/");
  }

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayName = user?.username ?? "User";
  const role = user?.role ?? "customer";

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Profile" />

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center border-2 border-gray-300">
              <Text className="text-4xl text-gray-500">
                {(displayName || "?").charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-black mt-3">
              {displayName}
            </Text>
            <Text className="text-base text-gray-500 mt-1 capitalize">
              {role}
            </Text>
          </View>

          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Account Details
          </Text>

          <Card className="mb-6 overflow-hidden">
            <DetailRow label="Username" value={displayName} />
            <DetailRow label="Email" value={user?.email ?? "—"} />
            <DetailRow label="Phone" value={user?.phone ?? "Not provided"} />
            <DetailRow label="Role" value={role} last />
          </Card>

          <PrimaryButton onPress={handleLogout}>Log Out</PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
}

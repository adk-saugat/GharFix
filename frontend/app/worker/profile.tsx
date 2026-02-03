import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getWorkerProfile } from "@/api/worker";
import { clearAuth } from "@/api/storage";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { DetailRow } from "@/components/DetailRow";
import { PrimaryButton } from "@/components/PrimaryButton";

type Worker = {
  id: string;
  username: string;
  email: string;
  phone: string;
  skills: string[];
  hourlyRate: number;
  completedJobs: number;
  avgRating: number;
  verificationLevel: string;
  createdAt: string;
};

export default function WorkerProfile() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    getWorkerProfile()
      .then(setWorker)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
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

  if (error) {
    return (
      <View className="flex-1 bg-white justify-center px-6">
        <Text className="text-red-600 text-center mb-4">{error}</Text>
        <PrimaryButton onPress={() => router.replace("/")}>
          Go Home
        </PrimaryButton>
      </View>
    );
  }

  if (!worker) return null;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Profile" />

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center border-2 border-gray-300">
              <Text className="text-4xl text-gray-500">
                {worker.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-black mt-3">
              {worker.username}
            </Text>
            <Text className="text-base text-gray-500 mt-1">Worker</Text>
          </View>

          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Account Details
          </Text>
          <Card className="mb-4 overflow-hidden">
            <DetailRow label="Username" value={worker.username} />
            <DetailRow label="Email" value={worker.email} />
            <DetailRow label="Phone" value={worker.phone || "Not provided"} />
          </Card>

          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Worker Details
          </Text>
          <Card className="mb-6 overflow-hidden">
            <DetailRow
              label="Skills"
              value={worker.skills?.join(", ") || "None"}
            />
            <DetailRow label="Hourly Rate" value={`$${worker.hourlyRate}`} />
            <DetailRow label="Completed Jobs" value={worker.completedJobs} />
            <DetailRow
              label="Average Rating"
              value={worker.avgRating?.toFixed(1) || "—"}
            />
            <DetailRow
              label="Verification"
              value={worker.verificationLevel || "—"}
              last
            />
          </Card>

          <PrimaryButton onPress={handleLogout}>Log Out</PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
}

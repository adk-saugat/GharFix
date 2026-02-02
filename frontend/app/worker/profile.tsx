import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getWorkerProfile } from "../../api/worker";
import { clearAuth } from "../../api/storage";

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

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <View className="px-4 py-4 border-b border-gray-300">
    <Text className="text-sm text-gray-500 mb-1">{label}</Text>
    <Text className="text-lg text-black">{value}</Text>
  </View>
);

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
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="bg-black py-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!worker) return null;

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-24 pb-4">
        <Text className="text-4xl font-bold text-black">Profile</Text>
      </View>

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
          <View className="border border-gray-300 rounded-lg overflow-hidden mb-4">
            <Row label="Username" value={worker.username} />
            <Row label="Email" value={worker.email} />
            <Row label="Phone" value={worker.phone || "Not provided"} />
          </View>

          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Worker Details
          </Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden mb-6">
            <Row label="Skills" value={worker.skills?.join(", ") || "None"} />
            <Row label="Hourly Rate" value={`$${worker.hourlyRate}`} />
            <Row label="Completed Jobs" value={worker.completedJobs} />
            <Row
              label="Average Rating"
              value={worker.avgRating?.toFixed(1) || "—"}
            />
            <View className="px-4 py-4">
              <Text className="text-sm text-gray-500 mb-1">Verification</Text>
              <Text className="text-lg text-black capitalize">
                {worker.verificationLevel || "—"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
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

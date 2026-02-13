import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getWorkerProfile } from "@/api/worker";
import { clearAuth } from "@/api/storage";
import { routes } from "@/utils/routes";
import { categoryLabel } from "@/constants/categories";
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

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

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
    router.replace(routes.home);
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-600 mt-3 text-base">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center px-6">
        <Text className="text-red-600 text-center mb-4 text-base">{error}</Text>
        <PrimaryButton onPress={() => router.replace(routes.home)}>
          Go home
        </PrimaryButton>
      </View>
    );
  }

  if (!worker) return null;

  const skillsDisplay =
    worker.skills?.length > 0
      ? worker.skills.map(categoryLabel).join(", ")
      : "None";

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Profile"
        subtitle="Manage your account"
        className="pt-28 pb-2"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-6">
          <View className="items-center mb-6">
            <View className="w-28 h-28 rounded-full bg-gray-200 justify-center items-center border-2 border-gray-300 shadow-sm">
              <Text className="text-5xl text-gray-500 font-medium">
                {worker.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-semibold text-black mt-4">
              {worker.username}
            </Text>
            <Text className="text-base text-gray-500 mt-1">Worker</Text>
            <TouchableOpacity
              onPress={() => {}}
              className="mt-4 px-6 py-3 rounded-lg border-2 border-gray-400 bg-white"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold text-gray-800">
                Edit profile
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Account details
          </Text>
          <Card className="mb-4 p-0 overflow-hidden">
            <DetailRow label="Username" value={worker.username} />
            <DetailRow label="Email" value={worker.email} />
            <DetailRow
              label="Phone"
              value={worker.phone || "Not provided"}
              last
            />
          </Card>

          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-2">
            Worker details
          </Text>
          <Card className="mb-6 p-0 overflow-hidden">
            <DetailRow label="Skills" value={skillsDisplay} />
            <DetailRow label="Hourly rate" value={`$${worker.hourlyRate}`} />
            <DetailRow label="Completed jobs" value={worker.completedJobs} />
            <DetailRow
              label="Average rating"
              value={
                worker.avgRating != null ? worker.avgRating.toFixed(1) : "—"
              }
            />
            <DetailRow
              label="Verification"
              value={capitalize(worker.verificationLevel || "—")}
              last
            />
          </Card>

          <PrimaryButton onPress={handleLogout}>Log out</PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
}

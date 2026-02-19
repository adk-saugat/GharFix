import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getJobs, type JobItem } from "@/api/worker";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { WorkerJobCard } from "@/components/WorkerJobCard";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";

const PREVIEW_JOBS_COUNT = 2;

export default function WorkerDashboard() {
  const router = useRouter();
  const { isChecking } = useAuthGuard("worker");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((list) => {
        const openOnly = (list ?? []).filter(
          (j) => (j.status ?? "").toLowerCase() === "open"
        );
        setJobs(openOnly);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  const previewJobs = jobs.slice(0, PREVIEW_JOBS_COUNT);
  const goToJob = (jobId: string) => router.push(routes.worker.job(jobId));

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Dashboard"
        subtitle="Here's what's going on with your home repairs."
      />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          <Card className="p-4 mb-4 border-gray-200 bg-white">
            <Text className="text-sm text-gray-500 mb-0.5">Total Earnings</Text>
            <Text className="text-3xl font-bold text-black">$1,240</Text>
            <Text className="text-xs text-gray-500 mt-0.5">This month</Text>
          </Card>

          <View className="flex-row gap-3 mb-4">
            <Card className="flex-1 p-3 items-center border-gray-200 bg-white">
              <Text className="text-2xl font-bold text-black">3</Text>
              <Text className="text-xs text-gray-600 mt-0.5">Active</Text>
            </Card>
            <Card className="flex-1 p-3 items-center border-gray-200 bg-white">
              <Text className="text-2xl font-bold text-black">12</Text>
              <Text className="text-xs text-gray-600 mt-0.5">Completed</Text>
            </Card>
            <Card className="flex-1 p-3 items-center border-gray-200 bg-white">
              <Text className="text-2xl font-bold text-black">4.8</Text>
              <Text className="text-xs text-gray-600 mt-0.5">Rating</Text>
            </Card>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-black">New Requests</Text>
            <TouchableOpacity
              onPress={() => router.push(routes.worker.services)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text className="text-base font-semibold text-gray-600">See more</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text className="text-gray-500 mb-6">Loading requests...</Text>
          ) : previewJobs.length === 0 ? (
            <EmptyState message="No new requests" className="mb-6" />
          ) : (
            previewJobs.map((job) => (
              <WorkerJobCard
                key={job.id}
                job={job}
                onPress={() => goToJob(job.id)}
                className="mb-3"
              />
            ))
          )}

          {previewJobs.length > 0 && <View className="mb-6" />}

          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <Card className="mb-3 p-4 border-gray-200 bg-white">
            <View className="flex-row justify-between items-start gap-2 mb-2">
              <Text className="text-lg font-semibold text-black flex-1">
                Electrical Wiring
              </Text>
              <View className="bg-yellow-100 px-2.5 py-1 rounded-lg">
                <Text className="text-yellow-800 text-xs font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-2">Lisa Chen</Text>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
              <Text className="text-xs text-gray-600 ml-2 flex-1">78 Elm St, Euless, TX</Text>
            </View>
          </Card>

          <Card className="mb-6 p-4 border-gray-200 bg-white">
            <View className="flex-row justify-between items-start gap-2 mb-2">
              <Text className="text-lg font-semibold text-black flex-1">
                Deck Repair
              </Text>
              <View className="bg-yellow-100 px-2.5 py-1 rounded-lg">
                <Text className="text-yellow-800 text-xs font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-2">Tom Wilson</Text>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
              <Text className="text-xs text-gray-600 ml-2 flex-1">9 Maple Lane, Euless, TX</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

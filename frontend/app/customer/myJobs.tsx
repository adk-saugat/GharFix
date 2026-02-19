import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getMyJobs, type JobItem } from "@/api/customer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { CustomerJobCard } from "@/components/CustomerJobCard";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";

function fetchJobs(setJobs: (j: JobItem[]) => void, setLoading: (v: boolean) => void) {
  setLoading(true);
  getMyJobs()
    .then(setJobs)
    .catch(() => setJobs([]))
    .finally(() => setLoading(false));
}

export default function MyJobsScreen() {
  const router = useRouter();
  const { isChecking } = useAuthGuard("customer");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => fetchJobs(setJobs, setLoading), []));

  const goToJob = (jobId: string) => router.push(routes.customer.job(jobId));

  if (isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="My Jobs"
        subtitle="View your requests and worker applications."
        className="pt-28 pb-3"
      />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" />
              <Text className="text-gray-600 mt-3">Loading jobs...</Text>
            </View>
          ) : jobs.length === 0 ? (
            <EmptyState message="You haven't posted any jobs yet." className="py-8" />
          ) : (
            jobs.map((job) => (
              <CustomerJobCard
                key={job.id}
                job={job}
                onPress={() => goToJob(job.id)}
                className="mb-3"
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

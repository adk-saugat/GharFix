import React, { useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getAppliedJobs, type AppliedJobItem } from "@/api/worker";
import { ScreenHeader } from "@/components/ScreenHeader";
import { WorkerJobCard } from "@/components/WorkerJobCard";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Applied() {
  const router = useRouter();
  const { isChecking } = useAuthGuard("worker");
  const [jobs, setJobs] = useState<AppliedJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getAppliedJobs()
        .then(setJobs)
        .catch(() => setJobs([]))
        .finally(() => setLoading(false));
    }, [])
  );

  const goToJob = (jobId: string) => router.push(routes.worker.job(jobId));

  if (isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Applied"
        subtitle="Jobs you've applied to"
      />

      {loading ? (
        <View className="flex-1 justify-center py-12">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="px-6 py-2 pb-8">
            {jobs.length === 0 ? (
              <EmptyState message="You haven't applied to any jobs yet" className="mt-4" />
            ) : (
              jobs.map((job) => (
                <WorkerJobCard
                  key={job.id}
                  job={{
                    ...job,
                    status: job.applicationStatus ?? job.status,
                  }}
                  onPress={() => goToJob(job.id)}
                  className="mb-3"
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

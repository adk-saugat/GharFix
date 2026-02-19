import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getMyJobs, type JobItem } from "@/api/customer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { CustomerJobCard } from "@/components/CustomerJobCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ActivityItem } from "@/components/ActivityItem";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";

const MY_JOBS_PREVIEW_COUNT = 3;

function fetchJobs(setJobs: (j: JobItem[]) => void, setLoading: (v: boolean) => void) {
  setLoading(true);
  getMyJobs()
    .then(setJobs)
    .catch(() => setJobs([]))
    .finally(() => setLoading(false));
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { isChecking } = useAuthGuard("customer");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchJobs(setJobs, setJobsLoading);
    }, [])
  );

  const goToJob = (jobId: string) => router.push(routes.customer.job(jobId));

  if (isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Dashboard"
        subtitle="Here's what's going on with your home repairs."
        className="pt-28 pb-3"
      />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          <PrimaryButton
            onPress={() => router.push(routes.customer.requestService)}
            className="mb-6 px-6"
          >
            Request Service
          </PrimaryButton>

          <Text className="text-2xl font-bold text-black mb-3">
            Recent Activity
          </Text>

          <ActivityItem
            title="John Smith accepted your Plumbing repair request"
            date="Jan 24, 2026 · 10:30 AM"
            dotColor="bg-blue-500"
          />
          <ActivityItem
            title="Electrical Work scheduled with Sarah Johnson"
            date="Jan 23, 2026 · 3:15 PM"
            dotColor="bg-green-500"
          />
          <ActivityItem
            title="Carpentry job completed by Mike Davis"
            date="Jan 20, 2026 · 2:00 PM"
            dotColor="bg-gray-400"
          />

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-black">My Jobs</Text>
            {jobs.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push(routes.customer.myJobs)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text className="text-base font-semibold text-gray-600">
                  See more
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {jobsLoading ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" />
              <Text className="text-gray-500 mt-2">Loading your jobs...</Text>
            </View>
          ) : jobs.length === 0 ? (
            <EmptyState
              message="You haven't posted any jobs yet."
              className="py-4 mb-6"
            />
          ) : (
            jobs.slice(0, MY_JOBS_PREVIEW_COUNT).map((job) => (
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

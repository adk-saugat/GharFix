import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getMyJobs, type JobItem } from "@/api/customer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { CustomerJobCard } from "@/components/CustomerJobCard";
import { PrimaryButton } from "@/components/PrimaryButton";

const MY_JOBS_PREVIEW_COUNT = 3;

export default function CustomerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setJobsLoading(false));
  }, []);

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
            onPress={() => router.push("/customer/requestService")}
            className="mb-6 px-6"
          >
            Request Service
          </PrimaryButton>

          <Text className="text-2xl font-bold text-black mb-3">
            Recent Activity
          </Text>

          <Card className="mb-3">
            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <View className="flex-1">
                <Text className="text-base font-medium text-black">
                  John Smith accepted your Plumbing repair request
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Jan 24, 2026 · 10:30 AM
                </Text>
              </View>
            </View>
          </Card>

          <Card className="mb-3">
            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <View className="flex-1">
                <Text className="text-base font-medium text-black">
                  Electrical Work scheduled with Sarah Johnson
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Jan 23, 2026 · 3:15 PM
                </Text>
              </View>
            </View>
          </Card>

          <Card className="mb-6">
            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-gray-400 mt-2" />
              <View className="flex-1">
                <Text className="text-base font-medium text-black">
                  Carpentry job completed by Mike Davis
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Jan 20, 2026 · 2:00 PM
                </Text>
              </View>
            </View>
          </Card>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-black">My Jobs</Text>
            {jobs.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push("/customer/myJobs")}
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
            <Text className="text-gray-500 py-4 mb-6">
              You haven't posted any jobs yet.
            </Text>
          ) : (
            jobs.slice(0, MY_JOBS_PREVIEW_COUNT).map((job) => (
              <CustomerJobCard
                key={job.id}
                job={job}
                onPress={() =>
                  router.push(
                    `/customer/job/${job.id}` as import("expo-router").Href
                  )
                }
                className="mb-3"
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

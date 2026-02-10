import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getMyJobs, type JobItem } from "@/api/customer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { CustomerJobCard } from "@/components/CustomerJobCard";

export default function MyJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

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
            <Text className="text-gray-500 py-8">
              You haven't posted any jobs yet.
            </Text>
          ) : (
            jobs.map((job) => (
              <CustomerJobCard
                key={job.id}
                job={job}
                onPress={() =>
                  router.push(
                    `/customer/job/${job.id}` as import("expo-router").Href,
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

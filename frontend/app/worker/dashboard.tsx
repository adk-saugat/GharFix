import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getJobs, type JobItem } from "@/api/worker";
import { categoryLabel } from "@/constants/categories";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";

export default function WorkerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const displayJobs = jobs.slice(0, 2);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Dashboard" subtitle="Welcome back!" />

      <ScrollView className="flex-1">
        <View className="px-6 py-2">
          <Card className="p-5 mb-6">
            <Text className="text-base text-gray-500 mb-1">Total Earnings</Text>
            <Text className="text-4xl font-bold text-black">$1,240</Text>
            <Text className="text-sm text-gray-500 mt-1">This month</Text>
          </Card>

          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">3</Text>
              <Text className="text-sm text-gray-600 mt-1">Active</Text>
            </Card>
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">12</Text>
              <Text className="text-sm text-gray-600 mt-1">Completed</Text>
            </Card>
            <Card className="flex-1 p-4 items-center">
              <Text className="text-3xl font-bold text-black">4.8</Text>
              <Text className="text-sm text-gray-600 mt-1">Rating</Text>
            </Card>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-black">New Requests</Text>
            <TouchableOpacity
              onPress={() => router.push("/worker/services")}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text className="text-base font-semibold text-gray-600">
                See more
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text className="text-gray-500 mb-6">Loading requests...</Text>
          ) : displayJobs.length === 0 ? (
            <Text className="text-gray-500 mb-6">No new requests</Text>
          ) : (
            displayJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => router.push(`/worker/job/${job.id}`)}
                activeOpacity={0.85}
              >
                <Card className="mb-3">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xl font-semibold text-black flex-1">
                      {job.title}
                    </Text>
                    <View className="bg-blue-100 px-3 py-1 rounded">
                      <Text className="text-blue-800 text-sm font-semibold">
                        {categoryLabel(job.status || "New")}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-base text-gray-600 mb-1">
                    Category: {categoryLabel(job.category ?? "")}
                  </Text>
                  <Text className="text-base text-gray-600 mb-2">
                    Customer: {job.username}
                  </Text>
                  <View className="flex-row justify-end w-full">
                    <Text className="text-base font-semibold text-gray-500">
                      View details →
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}

          {displayJobs.length > 0 && <View className="mb-6" />}

          <Text className="text-2xl font-bold text-black mb-3">
            Active Jobs
          </Text>

          <Card className="mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Electrical Wiring
              </Text>
              <View className="bg-yellow-100 px-3 py-1 rounded">
                <Text className="text-yellow-800 text-sm font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Lisa Chen
            </Text>
            <Text className="text-base text-gray-600">
              Address: 78 Elm St, Euless, TX
            </Text>
          </Card>

          <Card className="mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-black">
                Deck Repair
              </Text>
              <View className="bg-yellow-100 px-3 py-1 rounded">
                <Text className="text-yellow-800 text-sm font-semibold">
                  In Progress
                </Text>
              </View>
            </View>
            <Text className="text-base text-gray-600 mb-1">
              Customer: Tom Wilson
            </Text>
            <Text className="text-base text-gray-600">
              Address: 9 Maple Lane, Euless, TX
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

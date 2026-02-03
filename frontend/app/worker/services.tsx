import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getJobs, type JobItem } from "@/api/worker";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";

export default function Services() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    let list = jobs;
    const q = searchQuery.trim().toLowerCase();
    const category = skillFilter?.trim().toLowerCase() || null;

    if (category) {
      list = list.filter(
        (j) => (j.category ?? "").trim().toLowerCase() === category
      );
    }
    if (q) {
      list = list.filter(
        (j) =>
          (j.title ?? "").toLowerCase().includes(q) ||
          (j.category ?? "").toLowerCase().includes(q) ||
          (j.description ?? "").toLowerCase().includes(q) ||
          (j.username ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, searchQuery, skillFilter]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Services" subtitle="Available jobs" />

      <View className="px-6 pb-4">
        <TextInput
          className="border border-gray-400 px-5 py-4 rounded-xl text-xl text-black w-full h-16"
          placeholder="Search by title, category, customer..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 pb-3 max-h-12"
        contentContainerStyle={{
          paddingHorizontal: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setSkillFilter(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            skillFilter === null ? "bg-black" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              skillFilter === null ? "text-white" : "text-gray-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        {JOB_CATEGORIES.map((cat) => {
          const isSelected =
            (skillFilter ?? "").trim().toLowerCase() === cat.toLowerCase();
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSkillFilter(cat)}
              className={`px-4 py-2 rounded-full mr-2 ${
                isSelected ? "bg-black" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {categoryLabel(cat)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView className="flex-1">
        <View className="px-6 pb-8">
          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" />
              <Text className="text-gray-500 mt-3">Loading jobs...</Text>
            </View>
          ) : filteredJobs.length === 0 ? (
            <Text className="text-gray-500 text-center py-8">
              {jobs.length === 0 ? "No jobs available" : "No matches"}
            </Text>
          ) : (
            filteredJobs.map((job) => (
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
        </View>
      </ScrollView>
    </View>
  );
}

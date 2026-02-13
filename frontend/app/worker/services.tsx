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
import { getJobs, getWorkerProfile, type JobItem } from "@/api/worker";
import { categoryLabel } from "@/constants/categories";
import { ScreenHeader } from "@/components/ScreenHeader";
import { WorkerJobCard } from "@/components/WorkerJobCard";
import { EmptyState } from "@/components/EmptyState";
import { routes } from "@/utils/routes";

export default function Services() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [workerCategories, setWorkerCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getJobs(), getWorkerProfile()])
      .then(([jobsList, profile]) => {
        const openOnly = (jobsList ?? []).filter(
          (j) => (j.status ?? "").toLowerCase() === "open"
        );
        setJobs(openOnly);
        setWorkerCategories(profile?.skills ?? []);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cat = skillFilter?.trim().toLowerCase() ?? null;
    let list = jobs;
    if (cat) list = list.filter((j) => (j.category ?? "").trim().toLowerCase() === cat);
    if (q) {
      list = list.filter(
        (j) =>
          [j.title, j.category, j.description, j.username].some(
            (val) => (val ?? "").toLowerCase().includes(q)
          )
      );
    }
    return list;
  }, [jobs, searchQuery, skillFilter]);

  const goToJob = (jobId: string) => router.push(routes.worker.job(jobId));

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
        {workerCategories.map((cat) => {
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
            <EmptyState
              message={jobs.length === 0 ? "No jobs available" : "No matches"}
              className="py-8"
            />
          ) : (
            filteredJobs.map((job) => (
              <WorkerJobCard
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

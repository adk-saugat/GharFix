import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getJobs, type JobItem } from "@/api/worker";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function Services() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  async function load() {
    try {
      setError("");
      const list = await getJobs();
      setJobs(list);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
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

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Services" subtitle="Available jobs" />

      {error ? (
        <View className="px-6 py-4">
          <Text className="text-red-600 mb-4">{error}</Text>
          <PrimaryButton
            onPress={() => {
              setLoading(true);
              load();
            }}
            size="sm"
          >
            Retry
          </PrimaryButton>
        </View>
      ) : (
        <>
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

          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="px-6 pb-8">
              {filteredJobs.length === 0 ? (
                <Text className="text-gray-500 text-center py-8">
                  {jobs.length === 0 ? "No jobs available" : "No matches"}
                </Text>
              ) : (
                filteredJobs.map((job) => {
                  return (
                    <Card key={job.id} className="mb-3">
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-xl font-semibold text-black flex-1">
                          {categoryLabel(job.title)}
                        </Text>
                        <View className="bg-blue-100 px-3 py-1 rounded">
                          <Text className="text-blue-800 text-sm font-semibold">
                            {categoryLabel(job.status || "New")}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-base text-gray-600 mb-1">
                        Category: {categoryLabel(job.category || "")}
                      </Text>
                      <Text className="text-base text-gray-600 mb-1">
                        Customer: {categoryLabel(job.username)}
                      </Text>
                      <Text className="text-base text-gray-600 mb-3">
                        Address: {job.address}
                      </Text>
                      <View className="flex-row gap-3">
                        <TouchableOpacity className="flex-1 bg-black py-2 rounded-lg">
                          <Text className="text-white text-base font-semibold text-center">
                            Accept
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 border border-gray-400 py-2 rounded-lg">
                          <Text className="text-black text-base font-semibold text-center">
                            Decline
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  );
                })
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

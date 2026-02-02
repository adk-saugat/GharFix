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
import { getJobs, type JobItem } from "../../api/worker";

function cap(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Services() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const set = new Set(jobs.map((j) => j.category).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let list = jobs;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.category?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.username?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((j) => j.category === categoryFilter);
    }
    return list;
  }, [jobs, searchQuery, categoryFilter]);

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
      <View className="px-6 pt-24 pb-4">
        <Text className="text-4xl font-bold text-black">Services</Text>
        <Text className="text-lg text-gray-600 mt-1">Available jobs</Text>
      </View>

      {error ? (
        <View className="px-6 py-4">
          <Text className="text-red-600 mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              load();
            }}
            className="bg-black py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="px-6 pb-3">
            <TextInput
              className="border border-gray-400 px-4 py-3 rounded-lg text-base text-black w-full"
              placeholder="Search by title, category, customer..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {categories.length > 0 && (
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
                onPress={() => setCategoryFilter(null)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  categoryFilter === null ? "bg-black" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    categoryFilter === null ? "text-white" : "text-gray-700"
                  }`}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full mr-2 ${
                    categoryFilter === cat ? "bg-black" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      categoryFilter === cat ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

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
                    <View
                      key={job.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-hidden"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <View className="p-4">
                        <View className="flex-row justify-between items-start gap-3">
                          <View className="flex-1 min-w-0">
                            <Text
                              className="text-lg font-semibold text-black"
                              numberOfLines={2}
                            >
                              {cap(job.title)}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1.5">
                              {cap(job.category || "")}
                            </Text>
                            <Text
                              className="text-sm text-gray-600 mt-0.5"
                              numberOfLines={1}
                            >
                              {cap(job.username)}
                            </Text>
                          </View>
                          <View
                            className={`px-2.5 py-1 rounded-md ${
                              job.status === "new" || !job.status
                                ? "bg-blue-50"
                                : "bg-gray-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-semibold ${
                                job.status === "new" || !job.status
                                  ? "text-blue-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {cap(job.status || "New")}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
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

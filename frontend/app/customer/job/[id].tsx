import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getMyJobs,
  getJobApplications,
  acceptApplication,
  type JobApplicationItem,
  type JobItem,
} from "@/api/customer";
import { categoryLabel } from "@/constants/categories";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { BackHeader } from "@/components/BackHeader";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

export default function CustomerJobDetail() {
  const { id } = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobItem | null>(null);
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    Promise.all([getMyJobs(), getJobApplications(id)])
      .then(([jobs, apps]) => {
        setJob(jobs.find((j) => j.id === id) ?? null);
        setApplications(apps);
      })
      .catch(() => {
        setJob(null);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAccept(app: JobApplicationItem) {
    if (!id) return;
    setAcceptingId(app.id);
    try {
      await acceptApplication(id, app.id);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, status: "accepted" as const }
            : { ...a, status: "rejected" as const },
        ),
      );
      Alert.alert(
        "Worker accepted",
        `${app.workerName} has been assigned to this job.`,
        [{ text: "OK" }],
      );
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Could not accept application.",
      );
    } finally {
      setAcceptingId(null);
    }
  }

  if (loading) {
    return (
      <LoadingScreen
        onBack={() => router.back()}
        message="Loading applications..."
      />
    );
  }

  const displayTitle = job?.title ?? "Job details";

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader
        onBack={() => router.back()}
        title={displayTitle}
        subtitle="View applications and accept a worker"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Job summary */}
        {job && (
          <Card className="mb-6 p-5 border-gray-200 bg-white">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your request
            </Text>
            <Text className="text-base text-gray-800 leading-6 mb-4">
              {job.description || "No description."}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-gray-100 px-3 py-1.5 rounded-lg">
                <Text className="text-sm font-medium text-gray-700">
                  {categoryLabel(job.category ?? "")}
                </Text>
              </View>
            </View>
            {job.address ? (
              <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text
                  className="text-sm text-gray-600 ml-2 flex-1"
                  numberOfLines={2}
                >
                  {job.address}
                </Text>
              </View>
            ) : null}
          </Card>
        )}

        {/* Applications section */}
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-0.5">
          Applications ({applications.length})
        </Text>

        {applications.length === 0 ? (
          <Card className="p-8 border-gray-200 bg-white">
            <EmptyState
              message="No applications yet. Workers will see your job and can apply with a quote."
              className="py-0"
            />
          </Card>
        ) : (
          applications.map((app) => (
            <Card
              key={app.id}
              className="mb-4 p-5 border-gray-200 bg-white overflow-hidden"
            >
              <View className="flex-row justify-between items-start gap-3 mb-4">
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-lg font-semibold text-black"
                    numberOfLines={1}
                  >
                    {app.workerName}
                  </Text>
                  <View className="flex-row items-center mt-1.5 gap-4">
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-1.5">
                        {app.workerPhone || "Not provided"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-sm font-semibold text-black">
                        ${app.proposedPrice.toFixed(2)}
                      </Text>
                      <Text className="text-xs text-gray-500 ml-0.5">
                        quote
                      </Text>
                    </View>
                  </View>
                </View>
                <StatusBadge
                  status={app.status}
                  label={categoryLabel(app.status)}
                />
              </View>
              {app.status === "pending" && (
                <PrimaryButton
                  onPress={() => handleAccept(app)}
                  disabled={acceptingId !== null}
                  loading={acceptingId === app.id}
                  size="sm"
                  className="mt-1"
                >
                  Accept this worker
                </PrimaryButton>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

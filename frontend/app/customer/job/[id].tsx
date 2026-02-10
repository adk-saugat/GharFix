import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getJobApplications,
  acceptApplication,
  type JobApplicationItem,
} from "@/api/customer";
import { categoryLabel } from "@/constants/categories";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function CustomerJobDetail() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getJobApplications(id)
      .then(setApplications)
      .catch(() => setApplications([]))
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
            ? { ...a, status: "accepted" }
            : { ...a, status: "rejected" },
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
      <View className="flex-1 bg-gray-50">
        <View className="pt-14 px-4 pb-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={26} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" />
          <Text className="text-gray-600 mt-3">Loading applications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-24 px-6 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 mb-3 self-start"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black" numberOfLines={2}>
          {title ?? "Applications"}
        </Text>
        <Text className="text-base text-gray-600 mt-1">
          Accept a worker for this job
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {applications.length === 0 ? (
          <Text className="text-gray-500 py-4">No applications yet.</Text>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="mb-4 p-4">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-semibold text-black">
                  {app.workerName}
                </Text>
                <View
                  className={`px-3 py-1 rounded ${
                    app.status === "accepted"
                      ? "bg-green-100"
                      : app.status === "rejected"
                        ? "bg-gray-100"
                        : "bg-blue-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      app.status === "accepted"
                        ? "text-green-800"
                        : app.status === "rejected"
                          ? "text-gray-600"
                          : "text-blue-800"
                    }`}
                  >
                    {categoryLabel(app.status)}
                  </Text>
                </View>
              </View>
              <Text className="text-base text-gray-600 mb-1">
                Phone:{" "}
                {app.workerPhone == "" ? "Not Provided." : app.workerPhone}
              </Text>
              <Text className="text-base text-gray-600 mb-3">
                Proposed price: ${app.proposedPrice.toFixed(2)}
              </Text>
              {app.status === "pending" && (
                <PrimaryButton
                  onPress={() => handleAccept(app)}
                  disabled={acceptingId !== null}
                  loading={acceptingId === app.id}
                  size="sm"
                >
                  Accept
                </PrimaryButton>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

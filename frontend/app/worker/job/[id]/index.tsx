import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getJob,
  applyForJob,
  markJobComplete,
  type JobItem,
  type MyJobApplication,
} from "@/api/worker";
import { categoryLabel } from "@/constants/categories";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Input } from "@/components/Input";
import { BackHeader } from "@/components/BackHeader";
import { LoadingScreen } from "@/components/LoadingScreen";
import { NotFoundScreen } from "@/components/NotFoundScreen";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const goBack = (router: ReturnType<typeof useRouter>) =>
  router.replace(routes.worker.services);

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isChecking } = useAuthGuard("worker");
  const [job, setJob] = useState<JobItem | null>(null);
  const [myApplication, setMyApplication] = useState<MyJobApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [proposedPrice, setProposedPrice] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setJob(null);
      setMyApplication(null);
      setLoading(false);
      return;
    }
    getJob(id)
      .then(({ job: j, myApplication: app }) => {
        setJob(j);
        setMyApplication(app);
      })
      .catch(() => {
        setJob(null);
        setMyApplication(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply() {
    if (!job?.id) return;
    setApplyError("");
    const price = parseFloat(proposedPrice.trim());
    if (!proposedPrice.trim() || isNaN(price) || price < 0) {
      setApplyError("Enter a valid proposed price.");
      return;
    }
    setApplyLoading(true);
    try {
      await applyForJob(job.id, price);
      setMyApplication({
        id: "",
        jobId: job.id,
        workerId: "",
        proposedPrice: price,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      Alert.alert(
        "Application sent",
        "Your application has been submitted. The customer will review it.",
        [{ text: "OK", onPress: () => goBack(router) }],
      );
    } catch (e) {
      setApplyError(
        e instanceof Error ? e.message : "Could not submit application.",
      );
    } finally {
      setApplyLoading(false);
    }
  }

  async function handleMarkComplete() {
    if (!id || !job) return;
    setCompleteLoading(true);
    try {
      await markJobComplete(id);
      setJob({ ...job, status: "completed" });
      Alert.alert(
        "Job completed",
        "The customer will be notified to pay for the job.",
        [{ text: "OK" }],
      );
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Could not mark job complete.",
      );
    } finally {
      setCompleteLoading(false);
    }
  }

  if (isChecking) {
    return (
      <LoadingScreen
        onBack={() => goBack(router)}
        message="Verifying authentication..."
      />
    );
  }

  if (loading) {
    return (
      <LoadingScreen onBack={() => goBack(router)} message="Loading job..." />
    );
  }

  if (!job) {
    return (
      <NotFoundScreen
        onBack={() => goBack(router)}
        message="Job not found"
        backLabel="Back"
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader
        onBack={() => goBack(router)}
        title={job.title}
        subtitle={categoryLabel(job.category ?? "")}
        titleClassName="text-4xl font-bold text-black"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 32,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Job details */}
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-0.5">
          Job details
        </Text>
        <Card className="mb-6 p-5 border-gray-200 bg-white">
          <Text className="text-base text-gray-800 leading-6 mb-4">
            {job.description || "No description provided."}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            <View className="bg-gray-100 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-gray-700">
                {categoryLabel(job.category ?? "")}
              </Text>
            </View>
            <View className="bg-blue-50 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-blue-800">
                {categoryLabel(job.status || "open")}
              </Text>
            </View>
          </View>
          <View className="border-t border-gray-100 pt-3">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">{job.username}</Text>
            </View>
            {job.address ? (
              <View className="flex-row items-start mt-2">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#6B7280"
                  style={{ marginTop: 2 }}
                />
                <Text
                  className="text-sm text-gray-600 ml-2 flex-1"
                  numberOfLines={2}
                >
                  {job.address}
                </Text>
              </View>
            ) : null}
          </View>
        </Card>

        {/* Application status or apply form */}
        {myApplication ? (
          <>
            <Card className="p-5 border-green-200 bg-green-50 mb-6">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  {myApplication.status === "accepted"
                    ? "Application accepted"
                    : "Application submitted"}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 leading-5">
                {myApplication.status === "accepted"
                  ? `Your quote of $${myApplication.proposedPrice.toFixed(2)} was accepted. You can chat with the customer to coordinate the job.`
                  : `Your quote of $${myApplication.proposedPrice.toFixed(2)} has been sent. The customer will review it and get in touch.`}
              </Text>
              {myApplication.status === "accepted" && id ? (
                <>
                  <TouchableOpacity
                    onPress={() => router.push(routes.worker.jobChat(id))}
                    className="flex-row items-center justify-center gap-2 mt-4 pt-4 border-t border-green-200 py-3"
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={20}
                      color="#059669"
                    />
                    <Text className="text-base font-semibold text-green-800">
                      Open chat
                    </Text>
                  </TouchableOpacity>
                  {job.status === "assigned" ? (
                    <PrimaryButton
                      onPress={handleMarkComplete}
                      loading={completeLoading}
                      disabled={completeLoading}
                      size="sm"
                      className="mt-3"
                    >
                      Mark complete
                    </PrimaryButton>
                  ) : null}
                  {job.status === "completed" ? (
                    <View className="mt-3 py-2 px-3 bg-green-100 rounded-lg">
                      <Text className="text-sm font-medium text-green-800">
                        Job completed. Waiting for customer payment.
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : null}
            </Card>
          </>
        ) : (
          <>
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-0.5">
              Apply for this job
            </Text>
            <Card className="p-5 border-gray-200 bg-white">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Your proposed price ($)
              </Text>
              <Input
                placeholder="Enter your quote"
                value={proposedPrice}
                onChangeText={setProposedPrice}
                keyboardType="decimal-pad"
                className="mb-3"
              />
              {applyError ? (
                <View className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                  <Text className="text-red-600 text-sm">{applyError}</Text>
                </View>
              ) : null}
              <PrimaryButton
                onPress={handleApply}
                disabled={applyLoading}
                loading={applyLoading}
              >
                Submit application
              </PrimaryButton>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

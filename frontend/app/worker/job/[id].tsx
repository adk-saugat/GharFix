import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getJob, type JobItem } from "@/api/worker";
import { categoryLabel } from "@/constants/categories";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Input } from "@/components/Input";
import { DetailRow } from "@/components/DetailRow";

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [proposedPrice, setProposedPrice] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    if (!id) {
      setJob(null);
      setLoading(false);
      return;
    }
    getJob(id)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleApply() {
    if (!job) return;
    setApplyError("");
    setApplyLoading(true);
    const priceStr = proposedPrice.trim();
    const price = priceStr === "" ? null : parseFloat(priceStr);
    if (priceStr !== "" && (isNaN(price as number) || (price as number) < 0)) {
      setApplyError("Enter a valid price or leave blank.");
      setApplyLoading(false);
      return;
    }
    setApplyLoading(false);
    Alert.alert(
      "Application sent",
      "Your application has been submitted. The customer will review it.",
      [{ text: "OK", onPress: () => router.replace("/worker/services") }]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="pt-14 px-4 pb-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.replace("/worker/services")}
            className="p-2 -ml-2"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={26} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" />
          <Text className="text-gray-600 mt-3">Loading job...</Text>
        </View>
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="pt-14 px-4 pb-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.replace("/worker/services")}
            className="p-2 -ml-2"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={26} color="#111827" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-600 text-center mb-4">Job not found</Text>
          <PrimaryButton
            onPress={() => router.replace("/worker/services")}
            size="sm"
          >
            Back
          </PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-24 px-6 pb-4">
        <TouchableOpacity
          onPress={() => router.replace("/worker/services")}
          className="p-2 -ml-2 mb-3 self-start"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text className="text-4xl font-bold text-black" numberOfLines={2}>
          {job.title}
        </Text>
        <Text className="text-lg text-gray-600 mt-1" numberOfLines={1}>
          {categoryLabel(job.category ?? "")}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 24,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card className="mb-4 p-0 overflow-hidden">
          <DetailRow label="Description" value={job.description || "—"} />
          <DetailRow
            label="Category"
            value={categoryLabel(job.category ?? "")}
          />
          <DetailRow label="Customer" value={job.username} />
          <DetailRow label="Address" value={job.address} />
          <DetailRow
            label="Status"
            value={categoryLabel(job.status || "open")}
            last
          />
        </Card>

        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Apply for this job
        </Text>
        <Card className="mb-4 p-4">
          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            Proposed price ($)
          </Text>
          <Input
            placeholder="Optional - enter your quote"
            value={proposedPrice}
            onChangeText={setProposedPrice}
            keyboardType="decimal-pad"
            className="mb-3"
          />
          {applyError ? (
            <Text className="text-red-600 text-sm mb-3">{applyError}</Text>
          ) : null}
          <PrimaryButton
            onPress={handleApply}
            disabled={applyLoading}
            loading={applyLoading}
          >
            Submit application
          </PrimaryButton>
        </Card>
      </ScrollView>
    </View>
  );
}

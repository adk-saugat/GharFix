import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMyJobs, getJobApplications } from "@/api/customer";
import { BackHeader } from "@/components/BackHeader";
import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function CustomerJobPay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isChecking } = useAuthGuard("customer");
  const [amount, setAmount] = useState<number | null>(null);
  const [workerName, setWorkerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    Promise.all([getMyJobs(), getJobApplications(id)])
      .then(([jobs, apps]) => {
        const job = jobs.find((j) => j.id === id);
        const accepted = apps.find((a) => a.status === "accepted");
        if (job && accepted) {
          setJobTitle(job.title);
          setWorkerName(accepted.workerName);
          setAmount(accepted.proposedPrice);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function handlePay() {
    Alert.alert("Coming soon", "Payment integration will be added here.");
  }

  if (isChecking) {
    return (
      <LoadingScreen
        onBack={() => router.back()}
        message="Verifying authentication..."
      />
    );
  }

  if (loading) {
    return <LoadingScreen onBack={() => router.back()} message="Loading..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader onBack={() => router.back()} title="Pay for job" />

      <View className="flex-1 px-5 pt-6">
        <Card className="p-5 border-gray-200 bg-white">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Job
          </Text>
          <Text className="text-lg font-semibold text-black mb-1">
            {jobTitle || "Job"}
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Completed by {workerName || "worker"}
          </Text>
          <View className="border-t border-gray-100 pt-4">
            <Text className="text-sm text-gray-500 mb-0.5">Amount due</Text>
            <Text className="text-2xl font-bold text-black">
              ${amount != null ? amount.toFixed(2) : "0.00"}
            </Text>
          </View>
        </Card>

        <PrimaryButton onPress={handlePay} className="mt-6">
          Pay now
        </PrimaryButton>
      </View>
    </View>
  );
}

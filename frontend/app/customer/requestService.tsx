import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { createJob } from "@/api/jobs";
import { getUser } from "@/api/storage";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { routes } from "@/utils/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function RequestService() {
  const router = useRouter();
  const { isChecking } = useAuthGuard("customer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(null);
    setAddress("");
  };

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !category || !address.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const user = await getUser();
    if (!user?.id) {
      setError("You must be logged in to request a service.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createJob({
        customerId: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        address: address.trim(),
      });
      Alert.alert("Request added", "Your service request has been submitted.", [
        { text: "OK", onPress: () => { resetForm(); router.replace(routes.customer.dashboard); } },
      ]);
    } catch (e) {
      setError((e as Error).message ?? "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  }

  if (isChecking) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Request Service"
        subtitle="Describe what you need and we’ll match you with a worker."
        className="pt-28 pb-1"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 gap-4 py-2">
            <Card className="p-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                What do you need?
              </Text>
              <Input
                className="mb-3"
                placeholder="e.g. Fix kitchen sink"
                value={title}
                onChangeText={setTitle}
              />
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {JOB_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                      className={`px-4 py-2.5 rounded-lg border ${
                        isSelected
                          ? "bg-black border-black"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? "text-white" : "text-gray-700"
                        }`}
                        numberOfLines={1}
                      >
                        {categoryLabel(cat)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            <Card className="p-4">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Details
              </Text>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Description
              </Text>
              <Input
                className="mb-4"
                style={{ minHeight: 88 }}
                placeholder="Describe the issue or what you need done..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Service address
              </Text>
              <Input
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
              />
            </Card>

            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-2">
                <Text
                  className="text-red-700 text-sm font-medium"
                  numberOfLines={2}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <PrimaryButton
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
              className="mt-4"
            >
              Submit Request
            </PrimaryButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

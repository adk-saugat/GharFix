import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createJob } from "@/api/jobs";
import { getUser } from "@/api/storage";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function RequestService() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setCategory(null);
            setAddress("");
            router.replace("/customer/dashboard");
          },
        },
      ]);
    } catch (e) {
      setError((e as Error).message ?? "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Request Service" className="pt-28" />

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Title
          </Text>
          <Input
            className="mb-5"
            placeholder="e.g. Fix kitchen sink"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Category
          </Text>
          <View className="mb-5 relative">
            <TouchableOpacity
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="border border-gray-400 px-4 rounded-lg h-14 justify-center w-full"
            >
              <Text
                className={`text-xl ${category ? "text-black" : "text-gray-400"}`}
              >
                {category ? categoryLabel(category) : "Select a category"}
              </Text>
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View
                className="border border-gray-400 rounded-lg mt-2 bg-white absolute top-14 left-0 right-0 z-10"
                style={{ maxHeight: 180 }}
              >
                <ScrollView nestedScrollEnabled>
                  {JOB_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`px-4 py-3 border-b border-gray-200 ${
                        category === cat ? "bg-gray-100" : ""
                      }`}
                    >
                      <Text
                        className={`text-lg ${
                          category === cat
                            ? "text-black font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {category === cat ? "✓ " : ""}
                        {categoryLabel(cat)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Description
          </Text>
          <Input
            className="mb-5"
            style={{ minHeight: 120 }}
            placeholder="Describe the issue..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Address
          </Text>
          <Input
            className="mb-5"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />

          {error ? (
            <Text className="text-red-600 text-sm mb-4">{error}</Text>
          ) : null}

          <PrimaryButton
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
          >
            Submit Request
          </PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Masonry",
  "Cleaning",
  "General Handyman",
];

export default function RequestService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSubmit = () => {
    // handle submission
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-28 pb-4">
        <Text className="text-4xl font-bold text-black">Request Service</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {/* Title */}
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Title
          </Text>
          <TextInput
            className="border border-gray-400 px-4 rounded-lg mb-5 text-xl text-black w-full h-14"
            placeholder="e.g. Fix kitchen sink"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          {/* Category */}
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
                {category ?? "Select a category"}
              </Text>
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View
                className="border border-gray-400 rounded-lg mt-2 bg-white absolute top-14 left-0 right-0 z-10"
                style={{ maxHeight: 180 }}
              >
                <ScrollView nestedScrollEnabled>
                  {CATEGORIES.map((cat) => (
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
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Description */}
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            className="border border-gray-400 px-4 py-3 rounded-lg mb-5 text-xl text-black w-full"
            style={{ minHeight: 120 }}
            placeholder="Describe the issue..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Address */}
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Address
          </Text>
          <TextInput
            className="border border-gray-400 px-4 rounded-lg mb-8 text-xl text-black w-full h-14"
            placeholder="Enter your address"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-black py-4 rounded-lg w-full"
          >
            <Text className="text-xl font-semibold text-white text-center">
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

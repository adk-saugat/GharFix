import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BackHeader } from "@/components/BackHeader";

export default function CustomerJobChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-white">
      <BackHeader
        onBack={() => router.back()}
        title="Chat"
        subtitle="Chat with worker"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 bg-gray-50 px-4 py-4"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-sm text-gray-500 text-center">
              No messages yet.{"\n"}Start the conversation below.
            </Text>
          </View>
        </ScrollView>
        <View className="flex-row items-center gap-2 p-4 border-t border-gray-200 bg-white">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base text-black"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            className="bg-black rounded-xl px-5 py-3 min-h-[48px] justify-center"
            onPress={() => setMessage("")}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

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
import { Card } from "./Card";

type JobChatPanelProps = {
  /** Optional label for the other party, e.g. "Worker" or "Customer" */
  otherPartyLabel?: string;
  className?: string;
};

export function JobChatPanel({
  otherPartyLabel = "Chat",
  className = "",
}: JobChatPanelProps) {
  const [message, setMessage] = useState("");

  return (
    <View className={className}>
      <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-0.5">
        Chat with {otherPartyLabel}
      </Text>
      <Card className="border-gray-200 bg-white overflow-hidden">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            className="max-h-64 min-h-48 bg-gray-50 px-3 py-4"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-sm text-gray-500 text-center">
                No messages yet.{"\n"}Start the conversation below.
              </Text>
            </View>
          </ScrollView>
          <View className="flex-row items-center gap-2 p-3 border-t border-gray-200 bg-white">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base text-black"
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              editable
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
      </Card>
    </View>
  );
}

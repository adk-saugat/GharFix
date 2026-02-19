import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BackHeader } from "@/components/BackHeader";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getJobMessages, sendJobMessage } from "@/api/customer";
import { getUser } from "@/api/storage";
import { formatMessageTime } from "@/utils/date";
import type { Message } from "@/api/types";

export default function CustomerJobChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isChecking } = useAuthGuard("customer");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getUser().then((user) => setCurrentUserId(user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getJobMessages(id)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNewMessage = useCallback(
    (msg: Message) => {
      if (msg.jobId !== id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    },
    [id],
  );

  useWebSocket(id, handleNewMessage);

  const handleSend = async () => {
    const content = message.trim();
    if (!content || !id || sending) return;

    setMessage("");
    setSending(true);
    try {
      const sent = await sendJobMessage(id, content);
      setMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
    } catch (_) {
      setMessage(content);
    } finally {
      setSending(false);
    }
  };

  if (isChecking) {
    return (
      <LoadingScreen
        onBack={() => router.back()}
        message="Verifying authentication..."
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader onBack={() => router.back()} title="Chat" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {loading ? (
            <View className="flex-1 justify-center items-center py-16">
              <ActivityIndicator size="small" color="#111827" />
              <Text className="text-sm text-gray-500 mt-2">
                Loading messages...
              </Text>
            </View>
          ) : messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-16">
              <Text className="text-sm text-gray-500 text-center">
                No messages yet.{"\n"}Start the conversation below.
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === currentUserId;
              return (
                <View
                  key={msg.id}
                  className={`mb-3 ${isOwn ? "items-end" : "items-start"}`}
                >
                  <View
                    className={`max-w-[80%] px-5 py-2 rounded-lg border ${
                      isOwn
                        ? "bg-black border-black"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-lg leading-6 ${
                        isOwn ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        isOwn ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatMessageTime(msg.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        <View className="flex-row items-end gap-3 px-5 py-4 border-t border-gray-200 bg-white">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base text-black min-h-[48px]"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            className="bg-black rounded-lg px-5 py-3 min-h-[48px] justify-center disabled:opacity-60"
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!message.trim() || sending}
          >
            <Text className="text-white text-base font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

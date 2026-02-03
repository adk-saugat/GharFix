import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { login } from "@/api/auth";
import { setAuth } from "@/api/storage";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function GharfixLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    if (!email.trim() || !password)
      return setError("Email and password are required.");
    setError("");
    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      await setAuth(data.token, data.user);

      if (data.user.role === "customer") router.replace("/customer/dashboard");
      else if (data.user.role === "worker") router.replace("/worker/dashboard");
      else {
        setError("Invalid user role.");
        setLoading(false);
        return;
      }
    } catch (e) {
      setError((e as Error).message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center items-center">
        <View className="justify-center items-center px-6 pt-12 pb-6 w-full max-w-md">
          <Text className="text-5xl font-bold text-black mb-2 text-center">
            Log in
          </Text>
          <Text className="text-lg text-gray-500 mb-1 text-center">
            Welcome back to Gharfix
          </Text>
          <Text className="text-base text-gray-400 text-center">
            Enter your email and password to access your account. We'll take you
            straight to your dashboard.
          </Text>
        </View>

        <View className="items-center px-6 pb-12 w-full">
          <View className="w-full max-w-md self-stretch">
            <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Text className="text-sm font-medium text-gray-500 mb-4">
                Sign in
              </Text>
              <Input
                className="mb-4"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View className="mb-4 relative">
                <Input
                  className="pr-12"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>

              {error ? (
                <Text className="text-red-600 text-sm mb-4">{error}</Text>
              ) : null}

              <PrimaryButton
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
                className="mb-5"
              >
                Log in
              </PrimaryButton>

              <View className="flex-row justify-center flex-wrap">
                <Text className="text-gray-500 text-base">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text className="text-black text-base font-semibold">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

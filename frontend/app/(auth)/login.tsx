import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/api/auth";
import { setAuth } from "@/api/storage";
import { Input } from "@/components/Input";
import { PasswordInput } from "@/components/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { routes } from "@/utils/routes";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

function getDashboardForRole(role: string): string | null {
  if (role === "customer") return routes.customer.dashboard;
  if (role === "worker") return routes.worker.dashboard;
  return null;
}

export default function GharfixLogin() {
  const router = useRouter();
  const { isChecking } = useRedirectIfAuthenticated();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isChecking) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      await setAuth(data.token, data.user);

      const dashboard = getDashboardForRole(data.user.role);
      if (dashboard) {
        router.replace(dashboard as import("expo-router").Href);
      } else {
        setError("Invalid user role.");
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

              <PasswordInput
                value={password}
                onChangeText={setPassword}
                className="mb-4"
              />

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
                <TouchableOpacity onPress={() => router.push(routes.register)}>
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

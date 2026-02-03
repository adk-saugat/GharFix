import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
      setError((e as Error)?.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white justify-center">
      <View className="px-6">
        <View className="w-full max-w-md mx-auto">
          <Text className="text-5xl font-bold text-black mb-12">Log In</Text>

          <Input
            className="mb-4"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="mb-6 relative">
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
            className="mb-4"
          >
            Log In
          </PrimaryButton>

          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-black text-base font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

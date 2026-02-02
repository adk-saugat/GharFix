import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../../api/auth";
import { setAuth } from "../../api/storage";

export default function GharfixLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

          <TextInput
            className="border border-gray-400 px-4 rounded-lg mb-4 text-xl text-black w-full h-14"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-400 px-4 rounded-lg mb-6 text-xl text-black w-full h-14"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <Text className="text-red-600 text-sm mb-4">{error}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-black py-4 rounded-lg w-full mb-4 disabled:opacity-60"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base text-center font-semibold">
                Log In
              </Text>
            )}
          </TouchableOpacity>

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

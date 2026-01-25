import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function GharfixLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegisterPress = () => router.push("/register");

  const handleLogin = () => router.push("/customer/dashboard");

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

          <TouchableOpacity
            className="bg-black py-4 rounded-lg w-full mb-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-base text-center font-semibold">
              Log In
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-base">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleRegisterPress}>
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

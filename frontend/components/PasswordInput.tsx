import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "./Input";

type PasswordInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  className?: string;
};

export function PasswordInput({
  value,
  onChangeText,
  placeholder = "Password",
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`relative ${className}`}>
      <Input
        className="pr-12"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
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
  );
}

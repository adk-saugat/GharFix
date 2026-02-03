import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type PrimaryButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: string;
  className?: string;
  size?: "default" | "sm";
};

const sizeClass = {
  default: "py-4",
  sm: "py-3",
};

export function PrimaryButton({
  onPress,
  disabled,
  loading,
  children,
  className = "",
  size = "default",
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`bg-black rounded-lg w-full disabled:opacity-60 ${sizeClass[size]} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-base text-center font-semibold">
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

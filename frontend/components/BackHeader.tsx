import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type BackHeaderProps = {
  onBack: () => void;
  title?: string;
  subtitle?: string;
  /** Compact bar (just back) vs full (back + title + subtitle) */
  variant?: "bar" | "full";
  /** Override title style, e.g. "text-4xl font-bold" */
  titleClassName?: string;
};

const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

export function BackHeader({
  onBack,
  title,
  subtitle,
  variant = "full",
  titleClassName = "text-2xl font-bold text-black",
}: BackHeaderProps) {
  return (
    <View className={variant === "bar" ? "pt-14 px-4 pb-2 flex-row items-center" : "pt-24 px-6 pb-4"}>
      <TouchableOpacity
        onPress={onBack}
        className={variant === "full" ? "p-2 -ml-2 mb-3 self-start" : "p-2 -ml-2"}
        hitSlop={hitSlop}
      >
        <Ionicons name="arrow-back" size={26} color="#111827" />
      </TouchableOpacity>
      {variant === "full" && (title != null || subtitle != null) && (
        <>
          {title != null && (
            <Text className={titleClassName} numberOfLines={2}>
              {title}
            </Text>
          )}
          {subtitle != null && (
            <Text className="text-base text-gray-600 mt-1">{subtitle}</Text>
          )}
        </>
      )}
    </View>
  );
}

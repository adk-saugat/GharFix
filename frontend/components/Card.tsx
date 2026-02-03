import React from "react";
import { View } from "react-native";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`border border-gray-300 rounded-lg p-4 ${className}`}>
      {children}
    </View>
  );
}

import React from "react";
import { TextInput, TextInputProps } from "react-native";

const baseClassName =
  "border border-gray-400 px-4 rounded-lg text-xl text-black w-full placeholder:text-gray-400";

type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className = "", style, ...props }: InputProps) {
  return (
    <TextInput
      placeholderTextColor="#9CA3AF"
      className={`${baseClassName} ${className}`}
      style={[{ minHeight: 56 }, style]}
      {...props}
    />
  );
}

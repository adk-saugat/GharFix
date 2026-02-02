import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Home = () => {
  const route = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <Text className="text-5xl font-bold text-black mb-3">Gharfix</Text>
          <Text className="text-xl text-gray-600">Fixing homes, locally!</Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            onPress={() => route.push("/login")}
            className="bg-black py-4 rounded-lg mb-4"
          >
            <Text className="text-white text-base font-semibold text-center">
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => route.push("/register")}
            className="border border-gray-400 py-4 rounded-lg"
          >
            <Text className="text-black text-base font-semibold text-center">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;

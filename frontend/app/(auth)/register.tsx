import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const AVAILABLE_SKILLS = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "HVAC",
  "Roofing",
  "Flooring",
  "Landscaping",
];

export default function GharfixRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const router = useRouter();

  const handleLoginPress = () => router.push("/login");

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center py-12">
        <View className="px-6">
          <View className="w-full mx-auto">
            <Text className="text-5xl font-bold text-black mb-12">
              Register
            </Text>

            {/* User Type Selection */}
            <View className="flex-row mb-6 gap-3">
              <TouchableOpacity
                onPress={() => setUserType("customer")}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  userType === "customer"
                    ? "bg-black border-black"
                    : "bg-white border-gray-400"
                }`}
              >
                <Text
                  className={`text-base text-center font-semibold ${
                    userType === "customer" ? "text-white" : "text-black"
                  }`}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setUserType("worker")}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  userType === "worker"
                    ? "bg-black border-black"
                    : "bg-white border-gray-400"
                }`}
              >
                <Text
                  className={`text-base text-center font-semibold ${
                    userType === "worker" ? "text-white" : "text-black"
                  }`}
                >
                  Worker
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="border border-gray-400 px-4 rounded-lg mb-4 text-xl text-black w-full h-14"
              placeholder="Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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
              className="border border-gray-400 px-4 rounded-lg mb-4 text-xl text-black w-full h-14"
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              className="border border-gray-400 px-4 rounded-lg mb-4 text-xl text-black w-full h-14"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Worker-specific fields */}
            {userType === "worker" && (
              <>
                <TextInput
                  className="border border-gray-400 px-4 rounded-lg mb-4 text-xl text-black w-full h-14"
                  placeholder="Hourly Rate ($)"
                  placeholderTextColor="#9CA3AF"
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  keyboardType="numeric"
                />

                {/* Skills Dropdown */}
                <View className="mb-4 relative">
                  <TouchableOpacity
                    onPress={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="border border-gray-400 px-4 rounded-lg h-14 justify-center w-full"
                  >
                    <Text className="text-xl text-gray-600">
                      {selectedSkills.length > 0
                        ? selectedSkills.join(", ")
                        : "Select Skills"}
                    </Text>
                  </TouchableOpacity>

                  {showSkillsDropdown && (
                    <View
                      className="border border-gray-400 rounded-lg mt-2 bg-white absolute top-16 left-0 right-0 z-10"
                      style={{ maxHeight: 180 }}
                    >
                      <ScrollView nestedScrollEnabled>
                        {AVAILABLE_SKILLS.map((skill) => (
                          <TouchableOpacity
                            key={skill}
                            onPress={() => toggleSkill(skill)}
                            className={`px-4 py-3 border-b border-gray-200 ${
                              selectedSkills.includes(skill)
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            <Text
                              className={`text-base ${
                                selectedSkills.includes(skill)
                                  ? "text-black font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {selectedSkills.includes(skill) ? "✓ " : ""}
                              {skill}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </>
            )}

            <TouchableOpacity className="bg-black py-4 rounded-lg w-full mb-4">
              <Text className="text-white text-base text-center font-semibold">
                Register
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text className="text-black text-base font-semibold">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

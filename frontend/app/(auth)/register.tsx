import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { registerCustomer, registerWorker } from "@/api/auth";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/PrimaryButton";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";

export default function GharfixRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password)
      return setError("Name, email and password are required.");
    setError("");
    setLoading(true);
    try {
      const payload = {
        username: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      };
      if (userType === "customer") await registerCustomer(payload);
      else await registerWorker(payload);
      router.replace("/login");
    } catch (e) {
      setError((e as Error)?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

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

            <Input
              className="mb-4"
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              className="mb-4"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              className="mb-4"
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              className="mb-4"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? (
              <Text className="text-red-600 text-sm mb-4">{error}</Text>
            ) : null}

            {/* Worker-specific fields */}
            {userType === "worker" && (
              <>
                <Input
                  className="mb-4"
                  placeholder="Hourly Rate ($)"
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
                        ? selectedSkills.map(categoryLabel).join(", ")
                        : "Select Skills"}
                    </Text>
                  </TouchableOpacity>

                  {showSkillsDropdown && (
                    <View
                      className="border border-gray-400 rounded-lg mt-2 bg-white absolute top-16 left-0 right-0 z-10"
                      style={{ maxHeight: 180 }}
                    >
                      <ScrollView nestedScrollEnabled>
                        {JOB_CATEGORIES.map((skill) => (
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
                              {categoryLabel(skill)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </>
            )}

            <PrimaryButton
              onPress={handleRegister}
              disabled={loading}
              loading={loading}
              className="mb-4"
            >
              Register
            </PrimaryButton>

            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
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

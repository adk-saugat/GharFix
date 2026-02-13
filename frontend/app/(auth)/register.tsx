import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { registerCustomer, registerWorker, login } from "@/api/auth";
import { setAuth } from "@/api/storage";
import { addWorkerProfile } from "@/api/worker";
import { Input } from "@/components/Input";
import { PasswordInput } from "@/components/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { JOB_CATEGORIES, categoryLabel } from "@/constants/categories";
import { routes } from "@/utils/routes";

type UserType = "customer" | "worker";

export default function GharfixRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("customer");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const payload = {
    username: name.trim(),
    email: email.trim(),
    password,
    phone: phone.trim() || undefined,
  };

  async function registerAndGoToDashboard(isCustomer: boolean) {
    const loginData = await login({ email: payload.email, password: payload.password });
    await setAuth(loginData.token, loginData.user);
    if (isCustomer) {
      router.replace(routes.customer.dashboard);
    } else {
      await addWorkerProfile({
        userId: loginData.user.id,
        skills: selectedSkills,
        hourlyRate: parseInt(hourlyRate.trim(), 10),
      });
      router.replace(routes.worker.dashboard);
    }
  }

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (userType === "worker") {
      if (selectedSkills.length === 0) { setError("Select at least one skill."); return; }
      const rate = parseInt(hourlyRate.trim(), 10);
      if (!hourlyRate.trim() || isNaN(rate) || rate < 0) { setError("Enter a valid hourly rate."); return; }
    }
    setError("");
    setLoading(true);
    try {
      if (userType === "customer") {
        await registerCustomer(payload);
        await registerAndGoToDashboard(true);
      } else {
        await registerWorker(payload);
        await registerAndGoToDashboard(false);
      }
    } catch (e) {
      setError((e as Error).message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center px-6 pt-24 pb-6 w-full">
        <View className="w-full max-w-md">
          <Text className="text-5xl font-bold text-black mb-2 text-center">
            Register
          </Text>
          <Text className="text-lg text-gray-500 mb-1 text-center">
            Create your Gharfix account
          </Text>
          <Text className="text-base text-gray-400 text-center">
            Join as a customer to request home services, or as a worker to find
            local jobs and grow your business.
          </Text>
        </View>
      </View>

      <View className="items-center px-6 pb-12 w-full">
        <View className="w-full max-w-md self-stretch">
          <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-500 mb-3">
              I want to
            </Text>
            <View className="flex-row mb-5 gap-3">
              <TouchableOpacity
                onPress={() => setUserType("customer")}
                className={`flex-1 py-3 rounded-xl border-2 ${
                  userType === "customer"
                    ? "bg-black border-black"
                    : "bg-white border-gray-300"
                }`}
                activeOpacity={0.85}
              >
                <Text
                  className={`text-base text-center font-semibold ${
                    userType === "customer" ? "text-white" : "text-black"
                  }`}
                >
                  Request services
                </Text>
                <Text
                  className={`text-xs text-center mt-0.5 ${
                    userType === "customer" ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setUserType("worker")}
                className={`flex-1 py-3 rounded-xl border-2 ${
                  userType === "worker"
                    ? "bg-black border-black"
                    : "bg-white border-gray-300"
                }`}
                activeOpacity={0.85}
              >
                <Text
                  className={`text-base text-center font-semibold ${
                    userType === "worker" ? "text-white" : "text-black"
                  }`}
                >
                  Offer services
                </Text>
                <Text
                  className={`text-xs text-center mt-0.5 ${
                    userType === "worker" ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  Worker
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-medium text-gray-500 mb-3">
              Your details
            </Text>
            <Input
              className="mb-4"
              placeholder="Full name"
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
              placeholder="Phone (optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              className="mb-4"
            />

            {userType === "worker" && (
              <>
                <Text className="text-sm font-medium text-gray-500 mb-3 mt-2">
                  Worker info
                </Text>
                <View className="mb-4 relative">
                  <TouchableOpacity
                    onPress={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="border border-gray-400 px-4 rounded-lg h-14 justify-center w-full"
                  >
                    <Text className="text-xl text-gray-600">
                      {selectedSkills.length > 0
                        ? selectedSkills.map(categoryLabel).join(", ")
                        : "Select skills you offer"}
                    </Text>
                  </TouchableOpacity>

                  {showSkillsDropdown && (
                    <View
                      className="border border-gray-200 rounded-xl mt-2 bg-white absolute top-16 left-0 right-0 z-10"
                      style={{ maxHeight: 180 }}
                    >
                      <ScrollView nestedScrollEnabled>
                        {JOB_CATEGORIES.map((skill) => (
                          <TouchableOpacity
                            key={skill}
                            onPress={() => toggleSkill(skill)}
                            className={`px-4 py-3 border-b border-gray-100 ${
                              selectedSkills.includes(skill) ? "bg-gray-50" : ""
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

                <Input
                  className="mb-4"
                  placeholder="Hourly rate ($)"
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  keyboardType="numeric"
                />
              </>
            )}

            {error ? (
              <Text className="text-red-600 text-sm mb-4">{error}</Text>
            ) : null}

            <PrimaryButton
              onPress={handleRegister}
              disabled={loading}
              loading={loading}
              className="mb-5"
            >
              Create account
            </PrimaryButton>

            <View className="flex-row justify-center flex-wrap">
              <Text className="text-gray-500 text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push(routes.login)}>
                <Text className="text-black text-base font-semibold">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

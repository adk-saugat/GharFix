import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>GharFix</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("./register")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 GharFix. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  signupLink: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
});

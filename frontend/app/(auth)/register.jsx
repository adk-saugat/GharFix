import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>GharFix</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

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
            placeholder="Create a password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.roleContainer}>
            <Pressable style={[styles.roleButton, styles.activeRole]}>
              <Text style={[styles.roleButtonText, styles.activeRoleText]}>
                Register as Customer
              </Text>
            </Pressable>
            <Pressable style={styles.roleButton}>
              <Text style={styles.roleButtonText}>Register as Worker</Text>
            </Pressable>
          </View>

          <Pressable style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("./login")}>
              <Text style={styles.loginLink}>Login</Text>
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

export default RegisterScreen;

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
  roleContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  roleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeRole: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeRoleText: {
    color: "#fff",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  loginLink: {
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

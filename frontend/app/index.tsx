import { Link, useRouter } from "expo-router";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>GharFix</Text>
          <Text style={styles.subtitle}>Fixing homes, locally!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              router.push("./login");
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.registerButton]}
            onPress={() => {
              router.push("./register");
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 GharFix. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

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
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
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

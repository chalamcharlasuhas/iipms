import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
const { height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageBackground
          style={{
            display: "flex",
            height: height / 3.5,
            width: 320,
            justifyContent: "center",
            alignItems: "center",
            
          }}
          resizeMode="contain"
          source={require("../assets/images/logo.png")}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.subHeader}>IIPMS</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Your Email"
          placeholderTextColor="#a0a0a0"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
        />
        <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admindashboard")} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>admin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/managerdashboard")} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>manager</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/forget")}>
          <Text style={styles.forgetPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container1: {
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  formContainer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  subHeader: {
    color: "#FF0000",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto",
  },
  input: {
    backgroundColor: "#ffffff",
    width: "100%",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  loginButton: {
    backgroundColor: "#1890ff",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Avenir-Medium" : "Roboto",
  },
  forgetPassword: {
    color: "#40c4ff",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});

export default LoginScreen;
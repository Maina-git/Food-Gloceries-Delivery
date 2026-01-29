
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/Firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignIn({ onAuthSuccess }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const handleAuth = async () => {
    // 🔑 ADMIN LOGIN (NO FIREBASE)
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      Alert.alert("Admin Login", "Welcome Admin 👑");
      onAuthSuccess({ isAdmin: true });
      return;
    }

    // Normal validation
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      if (!isLogin) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          email: user.email,
          role: "user",
          createdAt: new Date(),
        });

        Alert.alert("Success", "Account created!");
      } else {
        // LOGIN USER
        await signInWithEmailAndPassword(auth, email, password);
      }

      onAuthSuccess({ isAdmin: false });
    } catch (error: any) {
      Alert.alert("Auth Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/burger-5571385_1280.jpg")}
      style={styles.background}
      blurRadius={3}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}>

        <View style={styles.card}>
          <View style={styles.cardtitle}>
            <Image
              source={require("../../assets/images/food-removebg-preview.png")}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"/>

            <Text style={styles.title}>KULA APP</Text>
            <Text style={styles.subtitle}>
              Food & Groceries delivery app
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(true)}>

              <Text style={styles.toggleText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(false)}>
              <Text style={styles.toggleText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={name}
              onChangeText={setName}/>
          )}

          <TextInput
            placeholder="Email or Admin Username"
            placeholderTextColor="#aaa"
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}/>

          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}/>

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="white"/>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}/>
          )}

          <TouchableOpacity style={styles.authBtn} onPress={handleAuth}>
            <Text style={styles.authText}>
              {isLogin ? "Login" : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: { width: "100%", maxWidth: 380, gap: 15 },
  cardtitle: { alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "white" },
  subtitle: { color: "white" },

toggleContainer: {
  flexDirection: "row",
  marginBottom: 10,
},

toggleBtn: {
  flex: 1,
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 30,
},
 activeToggle: { backgroundColor: "#f032b0ff", borderRadius: 30 },
toggleText: {
  color: "white",
  fontWeight: "600",
  fontSize: 14,
  textAlign: "center",
},

  input: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    color: "white",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  passwordInput: { flex: 1, color: "white", paddingVertical: 14 },
  authBtn: {
    backgroundColor: "#f032b0ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  authText: { color: "white", fontWeight: "bold" },
});


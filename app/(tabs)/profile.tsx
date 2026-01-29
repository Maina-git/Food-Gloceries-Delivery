import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/Firebase";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  name?: string;
  username?: string;
  email?: string;
  description?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserProfile>({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    username: "",
    description: "",
  });

  /* ================= FETCH USER DATA ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || auth.currentUser?.displayName || "Kula User",
            username: data.username || "",
            email: data.email || auth.currentUser?.email || "",
            description: data.description || "Welcome to Kula Platform!",
          });
        }
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed Out", "You have been signed out successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/burger-5571385_1280.jpg")}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* PROFILE IMAGE */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../../assets/images/food-removebg-preview.png")}
              style={styles.avatar}
            />
          </View>

          {/* WELCOME MESSAGE */}
          <Text style={styles.welcome}>Welcome back,</Text>

  
          <Text style={styles.name}>{userData.name}</Text>
          {userData.username ? (
            <Text style={styles.username}>@{userData.username}</Text>
          ) : null}


          <Text style={styles.description}>{userData.description}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="white" />
            <Text style={styles.infoText}>{userData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="white" />
            <Text style={styles.infoText}>User</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  avatarWrapper: {
    backgroundColor: "#f032b0ff",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: { width: 90, height: 90, resizeMode: "contain" },
  welcome: { color: "#ccc", fontSize: 16, marginBottom: 4 },
  name: { fontSize: 22, fontWeight: "bold", color: "white" },
  username: { color: "#f032b0ff", fontSize: 14, marginBottom: 8 },
  description: { color: "#aaa", fontSize: 14, textAlign: "center", marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  infoText: { color: "white", fontSize: 15 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f032b0ff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 25,
  },
  logoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

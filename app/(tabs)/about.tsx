import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";

export default function About() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* App Logo / Image */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/1000_F_546170168_eYtBwWyZPqSO5tIqbyKTydugsFb50Oav.jpg")}
          style={styles.logo}
        />
      </View>

      {/* App Title */}
      <Text style={styles.title}>About KULA</Text>

      {/* About Description */}
      <Text style={styles.description}>
        Welcome to <Text style={{ fontWeight: "bold" }}>KULA</Text>, your trusted food ordering app. 
        {"\n\n"}We are committed to providing a safe and secure experience for all our users. 
        All transactions are fully encrypted and monitored to prevent fraud or unauthorized access.
        {"\n\n"}With KULA, you can enjoy your favorite meals worry-free. Your safety is our top priority!
      </Text>

      {/* Key Features / Safety */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🔒 Safe & Secure</Text>
          <Text style={styles.featureDesc}>
            All payments are secure and protected against fraud.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>💵 No Money Robbery</Text>
          <Text style={styles.featureDesc}>
            Your money is safe. You pay only for the food you order.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>✅ Reliable Service</Text>
          <Text style={styles.featureDesc}>
            We ensure every order is tracked until it reaches you.
          </Text>
        </View>
      </View>

      {/* Footer Note */}
      <Text style={styles.footer}>
        KULA App © 2026. All rights reserved.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  logoContainer: { alignItems: "center", marginVertical: 20 },
  logo: { width: 120, height: 120, borderRadius: 20 },
  title: { color: "#f032b0ff", fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  description: { color: "#ddd", fontSize: 16, lineHeight: 24, textAlign: "center", marginBottom: 24 },
  features: { marginBottom: 30 },
  featureCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureTitle: { color: "#f032b0ff", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  featureDesc: { color: "#ccc", fontSize: 14 },
  footer: { textAlign: "center", color: "#888", fontSize: 12, marginBottom: 20 },
});

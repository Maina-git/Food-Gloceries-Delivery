import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SignIn from "../auth/SignIn";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function onAuthSuccess(data: { isAdmin: boolean }) {
    setIsAuthenticated(true);
    setIsAdmin(data.isAdmin);
  }

  // Show SignIn if not authenticated
  if (!isAuthenticated) {
    return <SignIn onAuthSuccess={onAuthSuccess} />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#f032b0ff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#111",
          height: 120, // adjusted for mobile
          borderTopWidth: 0,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "index") {
            iconName = focused ? "fast-food" : "fast-food-outline";
          } else if (route.name === "cart") {
            iconName = focused ? "basket" : "basket-outline";
          } else if (route.name === "about") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline"; // fixed icon
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}>
      <Tabs.Screen name="index" options={{ title: "Menu" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="about" options={{ title: "About" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}


























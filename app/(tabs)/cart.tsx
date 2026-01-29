import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../config/Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
  image: any;
  location?: string;
  notes?: string;
  createdAt?: any;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: CartItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as CartItem;
        items.push({
          id: doc.id,
          name: data.name,
          desc: data.desc,
          price: data.price,
          qty: data.qty,
          image: data.image || require("../../assets/images/burger-5571385_1280.jpg"),
          location: data.location,
          notes: data.notes,
          createdAt: data.createdAt,
        });
      });
    
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setCartItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cartItems.length > 0 ? 2.5 : 0;
  const total = subtotal + delivery;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#f032b0ff" />
        <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>Loading Cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "white", fontSize: 18 }}>Your cart is empty 😔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              {item.location && <Text style={styles.location}>📍 {item.location}</Text>}
              {item.notes && <Text style={styles.notes}>📝 {item.notes}</Text>}
              <View style={styles.row}>
                <Text style={styles.price}>${(item.price * item.qty).toFixed(2)}</Text>
                <Text style={styles.qty}>Qty: {item.qty}</Text>
              </View>
            </View>
          </View>
        ))}

    
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery</Text>
            <Text style={styles.summaryText}>${delivery.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingTop: 60, paddingHorizontal: 16 },
  title: { color: "white", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: { flexDirection: "row", backgroundColor: "#1c1c1c", borderRadius: 16, padding: 12, marginBottom: 14 },
  image: { width: 90, height: 90, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  name: { color: "white", fontSize: 16, fontWeight: "bold" },
  desc: { color: "#aaa", fontSize: 12 },
  location: { color: "#ddd", fontSize: 12 },
  notes: { color: "#ddd", fontSize: 12, fontStyle: "italic" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#f032b0ff", fontWeight: "bold", fontSize: 16 },
  qty: { color: "#ccc", fontSize: 13 },
  summary: { backgroundColor: "#1c1c1c", borderRadius: 16, padding: 16, marginTop: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryText: { color: "#ccc", fontSize: 14 },
  totalText: { color: "#f032b0ff", fontWeight: "bold", fontSize: 18 },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 8 },
  checkoutBtn: { backgroundColor: "#f032b0ff", padding: 16, borderRadius: 14, alignItems: "center", marginVertical: 30 },
  checkoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});











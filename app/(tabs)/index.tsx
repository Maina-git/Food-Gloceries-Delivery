import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

const { width } = Dimensions.get("window");

interface FoodItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: any;
}

const foodImages: Record<string, any> = {
  tea: require("../../assets/images/burger-5571385_1280.jpg"),
  githeri: require("../../assets/images/burger-5571385_1280.jpg"),
  burger: require("../../assets/images/burger-5571385_1280.jpg"),
  pizza: require("../../assets/images/burger-5571385_1280.jpg"),
  chicken: require("../../assets/images/burger-5571385_1280.jpg"),
};

const getFoodImage = (name: string) => {
  const key = name.toLowerCase();
  return foodImages[key] || require("../../assets/images/burger-5571385_1280.jpg");
};

export default function Home() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [userName, setUserName] = useState("User");

  // Featured slides images
  const fastDeliveryImg = require("../../assets/images/ai-generated-8662826_1280.jpg");
  const affordablePricesImg = require("../../assets/images/bowl-5466249_1280.jpg");
  const qualityIngredientsImg = require("../../assets/images/fast-food-6974507_1280.jpg");

  const featuredFoods = [
    { id: 1, title: "Fast Delivery", desc: "Fresh meals at your doorstep", image: fastDeliveryImg },
    { id: 2, title: "Affordable Prices", desc: "Eat well, spend less", image: affordablePricesImg },
    { id: 3, title: "Quality Ingredients", desc: "Only the freshest and healthiest meals", image: qualityIngredientsImg },
  ];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = currentIndex === featuredFoods.length - 1 ? 0 : currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  /* ================= FETCH FOODS ================= */
  useEffect(() => {
    const fetchFoods = async () => {
      const snapshot = await getDocs(collection(db, "foods"));
      const foods: FoodItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        foods.push({
          id: doc.id,
          name: data.name,
          desc: data.desc,
          price: `$${data.price}`,
          image: getFoodImage(data.name),
        });
      });
      setMenuItems(foods);
    };
    fetchFoods();
  }, []);

  /* ================= FETCH USER NAME ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!auth.currentUser) return;
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.name || "User");
        }
      } catch (error: any) {
        console.log("Error fetching user:", error.message);
      }
    };
    fetchUser();
  }, []);

  /* ================= ORDER ITEM ================= */
  const orderItem = (item: FoodItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setLocation("");
    setNotes("");
    setModalVisible(true);
  };

  const confirmOrder = async () => {
    if (!selectedItem || !auth.currentUser) return;

    try {
      // Save order in "orders" DB
      const orderRef = doc(collection(db, "orders"));
      await setDoc(orderRef, {
        userId: auth.currentUser.uid,
        name: selectedItem.name,
        desc: selectedItem.desc,
        price: parseFloat(selectedItem.price.replace("$", "")),
        qty: quantity,
        image: selectedItem.image,
        location: location || "",
        notes: notes || "",
        createdAt: serverTimestamp(),
      });

      setModalVisible(false);
      Alert.alert(
        "Order Confirmed ✅",
        `${quantity} x ${selectedItem.name}\nDeliver to: ${location || "Not provided"}`
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const getTotal = () => {
    if (!selectedItem) return "0.00";
    const price = parseFloat(selectedItem.price.replace("$", ""));
    return (price * quantity).toFixed(2);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={styles.greetingSmall}>Hi {userName} 👋</Text>
          <Text style={styles.greetingBig}>What would you like today?</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {featuredFoods.map((food) => (
            <View key={food.id} style={[styles.slide, { width }]}>
              <Image source={food.image} style={styles.slideImage} />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>{food.title}</Text>
                <Text style={styles.slideDesc}>{food.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Our Menu Today: {new Date().toLocaleDateString()}</Text>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardPrice}>{item.price}</Text>
                  <TouchableOpacity style={styles.orderBtn} onPress={() => orderItem(item)}>
                    <Text style={styles.orderText}>Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <TextInput
              placeholder="Delivery location"
              placeholderTextColor="#aaa"
              style={styles.modalInput}
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              placeholder="Notes"
              placeholderTextColor="#aaa"
              style={styles.modalInput}
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.modalTotalRow}>
              <Text style={styles.modalTotalText}>Total</Text>
              <Text style={styles.modalTotalAmount}>${getTotal()}</Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmOrder}>
              <Text style={styles.confirmText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  greeting: { padding: 16, height: 120 },
  greetingSmall: { color: "#aaa", marginTop: 40, fontSize: 14 },
  greetingBig: { color: "white", fontSize: 22, fontWeight: "bold" },
  slide: { height: 260, borderRadius: 20, overflow: "hidden" },
  slideImage: { width: "100%", height: "100%" },
  slideOverlay: { position: "absolute", bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", width: "100%", padding: 16 },
  slideTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  slideDesc: { color: "#ddd", fontSize: 14 },
  menuSection: { padding: 16 },
  menuTitle: { color: "white", paddingVertical: 20, fontSize: 20 },
  card: { flexDirection: "row", backgroundColor: "#1c1c1c", borderRadius: 16, padding: 12, marginBottom: 16 },
  cardImage: { width: 90, height: 90, borderRadius: 12 },
  cardTitle: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  cardDesc: { color: "#aaa", fontSize: 12, marginVertical: 6 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between" },
  cardPrice: { color: "#f032b0ff", fontWeight: "bold" },
  orderBtn: { backgroundColor: "#f032b0ff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  orderText: { color: "white", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#1c1c1c", padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  modalInput: { borderColor: "#333", borderWidth: 1, color: "white", padding: 12, borderRadius: 12, marginBottom: 12 },
  modalTotalRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  modalTotalText: { color: "white", fontSize: 16 },
  modalTotalAmount: { color: "#f032b0ff", fontSize: 16, fontWeight: "bold" },
  confirmBtn: { backgroundColor: "#f032b0ff", padding: 14, borderRadius: 14, alignItems: "center" },
  confirmText: { color: "white", fontWeight: "bold" },
});

























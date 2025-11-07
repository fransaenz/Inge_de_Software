import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PedidoActivoScreen({ route, navigation }) {
  const { pedido } = route.params;
  const [retirado, setRetirado] = useState(pedido.estado === "en camino");

  const marcarRetirado = async () => {
  const stored = await AsyncStorage.getItem("pedidosRepartidor");
  const updated = JSON.parse(stored).map(p =>
    p.id === pedido.id ? { ...p, estado: "retirado" } : p
  );

  setRetirado(true);
  await AsyncStorage.setItem("pedidosRepartidor", JSON.stringify(updated));

  // ✅ actualizar también farmacia
  const storedFarmacia = await AsyncStorage.getItem("farmaciaOrders");
  if (storedFarmacia) {
    const orders = JSON.parse(storedFarmacia)
      .filter(o => o.id !== pedido.id); // 🔥 eliminar de vista farmacia

    await AsyncStorage.setItem("farmaciaOrders", JSON.stringify(orders));
  }

  Alert.alert("📦 Pedido retirado de farmacia", "Procede a entregar.");
};


  const marcarEntregado = async () => {
  const stored = await AsyncStorage.getItem("pedidosRepartidor");
  const updated = JSON.parse(stored).map(p =>
    p.id === pedido.id ? { ...p, estado: "entregado" } : p
  );

  await AsyncStorage.setItem("pedidosRepartidor", JSON.stringify(updated));
  navigation.replace("HomeRepartidor");
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 Pedido en proceso</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Farmacia:</Text>
        <Text style={styles.text}>{pedido.farmacia}</Text>

        <Text style={styles.label}>Dirección farmacia:</Text>
        <Text style={styles.text}>{pedido.direccionFarmacia}</Text>

        <Text style={styles.label}>Dirección de entrega:</Text>
        <Text style={styles.text}>{pedido.direccionCliente || "Dirección del cliente"}</Text>

        <Text style={styles.label}>Productos:</Text>
        <Text style={styles.text}>{pedido.productos}</Text>
      </View>

      {!retirado ? (
        <TouchableOpacity style={styles.button} onPress={marcarRetirado}>
          <Text style={styles.buttonText}>📦 Marcar como retirado</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: "#2E7D32" }]} onPress={marcarEntregado}>
          <Text style={styles.buttonText}>✅ Marcar como entregado</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: { fontWeight: "600", marginTop: 8 },
  text: { fontSize: 16, marginBottom: 6 },
  button: { backgroundColor: "#1565C0", padding: 14, borderRadius: 8, marginBottom: 10 },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600" }
});

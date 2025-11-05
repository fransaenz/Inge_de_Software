import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeRepartidorScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const loadPedidos = async () => {
      const stored = await AsyncStorage.getItem("pedidosRepartidor");

      if (stored) {
        setPedidos(JSON.parse(stored));
      } else {
        // ✅ Pedidos simulados LISTOS para repartidor
        const mockPedidos = [
          {
            id: "1",
            farmacia: "Farmacia Central",
            direccionFarmacia: "Av. Siempre Viva 742",
            direccionCliente: "Calle 50 #800",
            distancia: 2.4,
            productos: "Ibuprofeno + Amoxicilina",
            estado: "confirmado", // 👈 IMPORTANTE
          },
          {
            id: "2",
            farmacia: "Farmacity",
            direccionFarmacia: "Calle 12 #1200",
            direccionCliente: "Av. 7 #1420",
            distancia: 4.7,
            productos: "Paracetamol 500mg",
            estado: "confirmado", // 👈 IMPORTANTE
          }
        ];

        setPedidos(mockPedidos);
        await AsyncStorage.setItem("pedidosRepartidor", JSON.stringify(mockPedidos));
      }
    };

    loadPedidos();
  }, []);

  // ✅ Solo mostrar pedidos confirmados
  const pedidosDisponibles = pedidos.filter(p => p.estado === "confirmado");

  // ✅ Si tiene un pedido tomado, ir a pantalla activa
  const pedidoActivo = pedidos.find(p => p.estado === "asignado" || p.estado === "retirado");
  if (pedidoActivo) {
    navigation.replace("PedidoActivo", { pedido: pedidoActivo });
    return null;
  }

  const aceptarPedido = async (id) => {
  const repartidor = { nombre: "Repartidor Test" }; // luego vendrá del login
  
  const updated = pedidos.map(p =>
    p.id === id 
      ? { ...p, estado: "asignado", repartidor } // ✅ agregar repartidor
      : p
  );

  setPedidos(updated);
  await AsyncStorage.setItem("pedidosRepartidor", JSON.stringify(updated));

  // ✅ también actualizar almacenamiento de farmacia
  const storedFarmacia = await AsyncStorage.getItem("farmaciaOrders");
  if (storedFarmacia) {
    const orders = JSON.parse(storedFarmacia).map(o =>
      o.id === id ? { ...o, estado: "asignado", repartidor } : o
    );
    await AsyncStorage.setItem("farmaciaOrders", JSON.stringify(orders));
  }

  const pedido = updated.find(p => p.id === id);
  navigation.replace("PedidoActivo", { pedido });
};

  const rechazarPedido = async (id) => {
    const updated = pedidos.filter(p => p.id !== id);
    setPedidos(updated);
    await AsyncStorage.setItem("pedidosRepartidor", JSON.stringify(updated));

    Alert.alert("❌ Pedido rechazado", "Se asignará a otro repartidor");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.farmacia}</Text>
      <Text>📍 {item.direccionFarmacia}</Text>
      <Text>🏠 {item.direccionCliente}</Text>
      <Text>🛵 Distancia: {item.distancia} km</Text>
      <Text>💊 Pedido: {item.productos}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.accept} onPress={() => aceptarPedido(item.id)}>
          <Text style={styles.btnText}>Aceptar ✅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={() => rechazarPedido(item.id)}>
          <Text style={styles.btnText}>Rechazar ❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚚 Pedidos Disponibles</Text>

      <FlatList
        data={pedidosDisponibles.sort((a, b) => a.distancia - b.distancia)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: { padding: 14, backgroundColor: "#f9f9f9", borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  title: { fontSize: 18, fontWeight: "600" },
  buttons: { flexDirection: "row", marginTop: 10, gap: 10 },
  accept: { flex: 1, backgroundColor: "#2E7D32", padding: 10, borderRadius: 6 },
  reject: { flex: 1, backgroundColor: "#C62828", padding: 10, borderRadius: 6 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" }
});

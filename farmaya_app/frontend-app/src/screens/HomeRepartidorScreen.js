import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import API from "../api"; // ✅ importamos la instancia configurada de api.js

export default function HomeRepartidorScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar pedidos desde la API
  const fetchPedidos = async () => {
    try {
      const response = await API.get("pedidos/repartidor/"); // <-- ajusta el endpoint real
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al cargar pedidos del repartidor:", error);
      Alert.alert("Error", "No se pudieron cargar los pedidos disponibles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // 🔹 Filtrar pedidos disponibles
  const pedidosDisponibles = pedidos.filter(p => p.estado === "confirmado");

  // 🔹 Si tiene pedido activo, redirigir
  const pedidoActivo = pedidos.find(p => p.estado === "asignado" || p.estado === "retirado");
  if (pedidoActivo) {
    navigation.replace("PedidoActivo", { pedido: pedidoActivo });
    return null;
  }

  // 🔹 Aceptar pedido
  const aceptarPedido = async (id) => {
    try {
      const response = await API.patch(`pedidos/${id}/asignar/`, { estado: "asignado" }); // <-- ajusta el endpoint según tu backend
      const updated = pedidos.map(p => (p.id === id ? response.data : p));
      setPedidos(updated);
      navigation.replace("PedidoActivo", { pedido: response.data });
    } catch (error) {
      console.error("Error al aceptar pedido:", error);
      Alert.alert("Error", "No se pudo aceptar el pedido.");
    }
  };

  // 🔹 Rechazar pedido
  const rechazarPedido = async (id) => {
    try {
      await API.patch(`pedidos/${id}/rechazar/`, { estado: "rechazado" }); // <-- ajusta según backend
      const updated = pedidos.filter(p => p.id !== id);
      setPedidos(updated);
      Alert.alert("❌ Pedido rechazado", "Se asignará a otro repartidor");
    } catch (error) {
      console.error("Error al rechazar pedido:", error);
      Alert.alert("Error", "No se pudo rechazar el pedido.");
    }
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚚 Pedidos Disponibles</Text>

      <FlatList
        data={pedidosDisponibles.sort((a, b) => a.distancia - b.distancia)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    padding: 14,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "600" },
  buttons: { flexDirection: "row", marginTop: 10, gap: 10 },
  accept: { flex: 1, backgroundColor: "#2E7D32", padding: 10, borderRadius: 6 },
  reject: { flex: 1, backgroundColor: "#C62828", padding: 10, borderRadius: 6 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
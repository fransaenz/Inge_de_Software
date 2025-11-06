import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

export default function ProductosFarmaciaScreen({ route, navigation }) {
  const { farmacia } = route.params;
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener productos de esa farmacia
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await API.get(`productos/farmacia/${farmacia.id}/`);
        setProductos(response.data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error.response?.data || error);
        Alert.alert("Error", "No se pudieron cargar los productos de esta farmacia.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // 🔹 Crear pedido en el backend
  const realizarPedido = async (producto) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Sesión expirada", "Iniciá sesión nuevamente.");
        return;
      }

      const payload = {
        farmacia_id: farmacia.id,
        producto_id: producto.id,
        cantidad: 1,
        direccion_entrega: "Entrega a domicilio",
        metodo_pago: "efectivo",
      };

      const response = await API.post("pedidos/crear/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert(
        "✅ Pedido creado",
        `Tu pedido de "${producto.nombre}" fue enviado a ${farmacia.nombre}.`
      );
      console.log("📦 Pedido creado:", response.data);
    } catch (error) {
      console.error("❌ Error al crear pedido:", error.response?.data || error);
      Alert.alert("Error", "No se pudo realizar el pedido.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  if (productos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Esta farmacia no tiene productos cargados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍 Productos de {farmacia.nombre}</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              Alert.alert(
                "Confirmar pedido",
                `¿Querés pedir "${item.nombre}" a ${farmacia.nombre}?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Confirmar", onPress: () => realizarPedido(item) },
                ]
              )
            }
          >
            <Text style={styles.nombre}>{item.nombre}</Text>
            {item.descripcion ? (
              <Text style={styles.descripcion}>{item.descripcion}</Text>
            ) : null}
            <Text style={styles.precio}>💰 ${item.precio}</Text>
            {item.requiere_receta && <Text style={styles.receta}>📜 Requiere receta</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E88E5", marginBottom: 12 },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#333" },
  descripcion: { fontSize: 13, color: "#555", marginVertical: 4 },
  precio: { fontSize: 14, fontWeight: "600", color: "#2E7D32" },
  receta: { fontSize: 12, color: "red" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#888", fontSize: 16 },
});

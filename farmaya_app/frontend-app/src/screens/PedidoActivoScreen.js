import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, FlatList } from "react-native";
import API from "../api";

export default function PedidoActivoScreen({ route, navigation }) {
  const { pedido } = route.params;
  const [estado, setEstado] = useState(pedido.estado);
  const [loading, setLoading] = useState(false);

  const actualizarEstado = async (nuevoEstado, mensaje) => {
    try {
      setLoading(true);
      const response = await API.patch(`pedidos/${pedido.id}/`, { estado: nuevoEstado });
      setEstado(response.data.estado);
      Alert.alert(mensaje.titulo, mensaje.texto);
      if (nuevoEstado === "entregado") navigation.replace("HomeRepartidor");
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1565C0" />
        <Text>Actualizando pedido...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 Pedido en proceso</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Farmacia:</Text>
        <Text style={styles.text}>{pedido.farmacia_nombre}</Text>

        <Text style={styles.label}>Dirección de la farmacia:</Text>
        <Text style={styles.text}>{pedido.direccion_farmacia}</Text>

        <Text style={styles.label}>Dirección de entrega:</Text>
        <Text style={styles.text}>{pedido.direccion_entrega}</Text>

        <Text style={styles.label}>Productos:</Text>
        <FlatList
          data={pedido.detalles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.text}>
              • {item.producto.nombre} x{item.cantidad} (${item.precio_unitario})
            </Text>
          )}
        />
      </View>

      {estado !== "retirado" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            actualizarEstado("retirado", {
              titulo: "📦 Pedido retirado",
              texto: "Procede a entregar al cliente.",
            })
          }
        >
          <Text style={styles.buttonText}>📦 Marcar como retirado</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2E7D32" }]}
          onPress={() =>
            actualizarEstado("entregado", {
              titulo: "✅ Pedido entregado",
              texto: "Entrega registrada correctamente.",
            })
          }
        >
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
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600" },
});

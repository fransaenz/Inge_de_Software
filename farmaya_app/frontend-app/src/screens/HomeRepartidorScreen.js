import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';

export default function HomeRepartidorScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener pedidos asignados al repartidor
  const fetchPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Sesión expirada', 'Por favor, inicia sesión nuevamente.');
        return;
      }

      // ✅ Nueva ruta correcta
      const response = await API.get('accounts/pedidos/repartidor/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error.response?.data || error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // 🔹 Marcar pedido como entregado
  const marcarEntregado = async (id) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await API.put(
        `accounts/pedidos/${id}/`,
        { estado: 'entregado' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('✅ Entregado', 'Pedido marcado como entregado.');
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: 'entregado' } : p))
      );
    } catch (error) {
      console.error('Error al marcar como entregado:', error.response?.data || error);
      Alert.alert('Error', 'No se pudo actualizar el pedido.');
    }
  };

  const renderPedido = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>📦 Pedido #{item.id}</Text>
      <Text style={styles.text}>👤 Cliente: {item.usuario}</Text>
      <Text style={styles.text}>📍 Dirección: {item.direccion_entrega}</Text>
      <Text style={styles.text}>💊 Producto: {item.producto_nombre}</Text>
      <Text style={styles.text}>Estado: {item.estado}</Text>

      {item.estado !== 'entregado' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => marcarEntregado(item.id)}
        >
          <Text style={styles.buttonText}>Marcar como entregado</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛵 Pedidos Asignados</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPedido}
        ListEmptyComponent={<Text>No hay pedidos pendientes.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 15, marginBottom: 4 },
  button: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import API from '../api/api';

export default function PedidosFarmaciaScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener pedidos desde el backend
  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Sesión expirada', 'Por favor, inicie sesión nuevamente.');
        return;
      }

      // ✅ Ruta correcta del backend
      const response = await API.get('accounts/pedidos/farmacia/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error.response?.data || error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔹 Descargar y abrir receta
  const openFile = async (url) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
        return;
      }

      const fileUri = FileSystem.documentDirectory + 'receta_temp.pdf';
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error al abrir archivo:', error);
      Alert.alert('Error', 'No se pudo abrir la receta.');
    }
  };

  // 🔹 Validar receta → cambiar estado del pedido
  const validarReceta = async (pedidoId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await API.put(
        `accounts/pedidos/${pedidoId}/`,
        { estado: 'aprobado' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('✅ Receta validada', 'El pedido fue aprobado.');
      setOrders((prev) =>
        prev.map((o) => (o.id === pedidoId ? { ...o, estado: 'aprobado' } : o))
      );
    } catch (error) {
      console.error('Error al validar receta:', error.response?.data || error);
      Alert.alert('Error', 'No se pudo validar la receta.');
    }
  };

  // Filtrar para NO mostrar pedidos retirados
  const visibleOrders = orders.filter(o => o.estado !== 'retirado');

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>👤 Cliente: {item.usuario_email}</Text>
      <Text style={styles.text}>💊 Producto: {item.producto_nombre}</Text>
      <Text style={styles.text}>📦 Cantidad: {item.cantidad}</Text>
      <Text style={styles.text}>🏠 Dirección: {item.direccion_entrega}</Text>

      {item.receta_url ? (
        <>
          <Text style={styles.text}>🧾 Receta adjunta</Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openFile(item.receta_url)}
          >
            <Text style={styles.smallButtonText}>📄 Ver receta</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>🚫 No requiere receta</Text>
      )}

      <Text style={styles.text}>
        📌 Estado: {item.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Aprobado'}
      </Text>

      {item.estado === 'pendiente' && item.receta_url && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => validarReceta(item.id)}
        >
          <Text style={styles.buttonText}>Validar Receta</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Pedidos Recibidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay pedidos nuevos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 15, marginBottom: 6, color: '#333' },
  smallButton: {
    backgroundColor: '#6c8eff',
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
    width: 120,
  },
  smallButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});

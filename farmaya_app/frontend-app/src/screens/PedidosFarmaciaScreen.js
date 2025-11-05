import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function PedidosFarmacia() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const stored = await AsyncStorage.getItem('farmaciaOrders');

      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // ✅ Estados simulados correctos
        const initialOrders = [
          {
            id: '1',
            cliente: 'Juan Pérez',
            obraSocial: 'OSDE',
            receta: true,
            estado: 'pendiente_validacion',
            archivoURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          },
          {
            id: '2',
            cliente: 'Maria Lopez',
            obraSocial: 'IOMA',
            receta: false,
            estado: 'confirmado', // no necesita validación
            producto: 'Ibuprofeno 600mg'
          }
        ];

        setOrders(initialOrders);
        await AsyncStorage.setItem('farmaciaOrders', JSON.stringify(initialOrders));
      }
    };

    loadOrders();
  }, []);

  const openPDF = async (url) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
        return;
      }

      const fileUri = FileSystem.documentDirectory + 'temp.pdf';
      const downloaded = await FileSystem.downloadAsync(url, fileUri);
      await Sharing.shareAsync(downloaded.uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el archivo');
    }
  };

  const validarReceta = async (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, estado: 'confirmado' } : order
    );

    setOrders(updated);
    await AsyncStorage.setItem('farmaciaOrders', JSON.stringify(updated));
    Alert.alert('✅ Receta validada', 'El pedido está listo para repartidor.');
  };

  // Filtrar para NO mostrar pedidos retirados
  const visibleOrders = orders.filter(o => o.estado !== 'retirado');

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>👤 Cliente: {item.cliente}</Text>

{item.repartidor && (
  <Text style={styles.text}>🛵 Repartidor: {item.repartidor.nombre}</Text>
)}

<Text style={styles.text}>🏥 Obra social: {item.obraSocial}</Text>

      

      {item.receta ? (
        <>
          <Text style={styles.text}>🧾 Receta adjunta</Text>
          <TouchableOpacity style={styles.smallButton} onPress={() => openPDF(item.archivoURL)}>
            <Text style={styles.smallButtonText}>📄 Ver receta</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>🛒 Producto: {item.producto}</Text>
        </>
      )}

      <Text style={styles.text}>
        📌 Estado: {
          item.estado === 'pendiente_validacion' ? '⏳ Pendiente validación' :
          item.estado === 'confirmado' ? '✅ Confirmado' :
          item.estado === 'asignado' ? '📦 Asignado a repartidor' :
          item.estado === 'retirado' ? '🚚 Retirado' :
          item.estado === 'entregado' ? '🎉 Entregado' : item.estado
        }
      </Text>

      {/*Solo mostrar botón si tiene receta y está pendiente */}
      {item.receta && item.estado === 'pendiente_validacion' && (
        <TouchableOpacity style={styles.button} onPress={() => validarReceta(item.id)}>
          <Text style={styles.buttonText}>Validar Receta</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Pedidos Recibidos</Text>
      <FlatList
        data={visibleOrders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
    width: 120
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

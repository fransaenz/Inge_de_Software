import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function PedidosFarmacia() {
  const [orders, setOrders] = useState([]);

  // Cargar pedidos simulados o guardados
  useEffect(() => {
    const loadOrders = async () => {

      const stored = await AsyncStorage.getItem('farmaciaOrders');

      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Pedidos simulados - luego vendrán del backend
        const initialOrders = [
          {
            id: '1',
            cliente: 'Juan Pérez',
            obraSocial: 'OSDE',
            receta: true,
            estado: 'pendiente',
            archivo: 'receta_juan.pdf',
            archivoURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          },
          {
            id: '2',
            cliente: 'Maria Lopez',
            obraSocial: 'IOMA',
            receta: false,
            estado: 'confirmado',
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
    // 🌐 Web → abrir en nueva pestaña
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }

    // 📱 Mobile → descargar y abrir
    const fileUri = FileSystem.documentDirectory + 'temp.pdf';
    const downloaded = await FileSystem.downloadAsync(url, fileUri);

    await Sharing.shareAsync(downloaded.uri);
  } catch (error) {
    console.error('Error abriendo PDF:', error);
    Alert.alert('Error', 'No se pudo abrir el archivo');
  }
};

  const validarReceta = async (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, estado: 'validado' } : order
    );

    setOrders(updated);
    await AsyncStorage.setItem('farmaciaOrders', JSON.stringify(updated));

    Alert.alert('✅ Receta validada', 'El pedido ha sido confirmado.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>👤 Cliente: {item.cliente}</Text>
      <Text style={styles.text}>🏥 Obra social: {item.obraSocial}</Text>

      {item.receta ? (
        <>
          <Text style={styles.text}>🧾 Receta adjunta</Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openPDF(item.archivoURL)}
          >
            <Text style={styles.smallButtonText}>📄 Ver receta</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>🛒 Producto: {item.producto}</Text>
        </>
      )}

      <Text style={styles.text}>
        📌 Estado: {item.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Confirmado'}
      </Text>

      {item.receta && item.estado === 'pendiente' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => validarReceta(item.id)}
        >
          <Text style={styles.buttonText}>Validar Receta</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Pedidos Recibidos</Text>
      <FlatList
        data={orders}
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

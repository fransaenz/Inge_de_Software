import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

export default function BuscarFarmaciaScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [farmacias, setFarmacias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmacia, setSelectedFarmacia] = useState(null);

  // 📍 Obtener ubicación actual
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Error", "Se necesita permiso de ubicación para mostrar el mapa.");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
        Alert.alert("Error", "No se pudo obtener tu ubicación actual.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Cargar farmacias desde el backend
  const fetchFarmacias = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await API.get("usuarios/farmacias/", { headers });
      const farmaciasData = response.data;

      console.log("🔹 Farmacias desde backend:", farmaciasData);

      if (!farmaciasData || farmaciasData.length === 0) {
        Alert.alert("Aviso", "No hay farmacias registradas con ubicación.");
      }

      // 🔹 Normalizar datos
      const farmaciasConUbicacion = farmaciasData
        .filter((f) => f.latitud && f.longitud)
        .map((f) => ({
          id: f.id, // ✅ asegurar que el ID quede disponible
          nombre: f.nombre || "Farmacia sin nombre",
          latitud: parseFloat(f.latitud),
          longitud: parseFloat(f.longitud),
          direccion: f.direccion || "Dirección no disponible",
          telefono: f.telefono || "Sin teléfono",
          horarios: f.horarios || "8:00 a 20:00 hs",
        }));

      setFarmacias(farmaciasConUbicacion);
    } catch (error) {
      console.error("❌ Error cargando farmacias:", error.response?.data || error);
      Alert.alert(
        "Error",
        "No se pudieron cargar las farmacias. Verifica tu conexión o el backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Llamar al cargar la pantalla
  useEffect(() => {
    fetchFarmacias();
  }, []);

  // 🔹 Abrir en Google Maps
  const abrirEnMaps = (lat, lng) => {
    const url =
      Platform.OS === "ios"
        ? `maps://app?saddr=Ubicación+actual&daddr=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  // 🔹 Ir a los productos
  const realizarPedido = (farmacia) => {
    console.log("📦 Farmacia seleccionada:", farmacia); // ✅ Verificar que tenga ID
    if (!farmacia?.id) {
      Alert.alert("Error", "No se encontró el ID de la farmacia seleccionada.");
      return;
    }
    setSelectedFarmacia(null);
    navigation.navigate("ProductosFarmacia", { farmacia });
  };

  if (loading || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 8 }}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        loadingEnabled
      >
        {farmacias.map((f, index) => (
          <Marker
            key={f.id || index}
            coordinate={{
              latitude: f.latitud,
              longitude: f.longitud,
            }}
            title={f.nombre}
            description={f.direccion}
            onPress={() => setSelectedFarmacia(f)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerHalo} />
              <View style={styles.markerDot} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 🧩 Modal con info */}
      <Modal
        visible={!!selectedFarmacia}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFarmacia(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedFarmacia(null)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {selectedFarmacia?.nombre || "Sin nombre"}
            </Text>
            <Text>📍 {selectedFarmacia?.direccion}</Text>
            <Text>📞 {selectedFarmacia?.telefono}</Text>
            <Text>🕓 {selectedFarmacia?.horarios}</Text>

            <TouchableOpacity
              style={styles.btnPedido}
              onPress={() => realizarPedido(selectedFarmacia)}
            >
              <Text style={styles.btnPedidoText}>🛒 Realizar pedido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnMapa}
              onPress={() =>
                abrirEnMaps(selectedFarmacia.latitud, selectedFarmacia.longitud)
              }
            >
              <Text style={styles.btnMapaText}>📍 Ver en Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  markerContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  markerHalo: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,0,0,0.15)",
  },
  markerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    zIndex: 2,
  },
  closeText: { fontSize: 20, color: "#999" },
  btnPedido: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  btnPedidoText: { color: "#fff", fontWeight: "bold" },
  btnMapa: {
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  btnMapaText: { color: "#007AFF", fontWeight: "600" },
});

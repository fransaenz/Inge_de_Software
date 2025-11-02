import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileFarmaciaScreen({ navigation }) {
  const [farmacia, setFarmacia] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setFarmacia(JSON.parse(stored));
      }
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("isLoggedIn");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Perfil de la Farmacia</Text>

      <Text style={styles.label}>Nombre</Text>
      <Text style={styles.value}>{farmacia.nombre}</Text>

      <Text style={styles.label}>Dirección</Text>
      <Text style={styles.value}>{farmacia.direccion}</Text>

      <Text style={styles.label}>Teléfono</Text>
      <Text style={styles.value}>{farmacia.telefono}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{farmacia.email}</Text>

      <Text style={styles.label}>Horarios</Text>
      <Text style={styles.value}>{farmacia.horarios}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditarPerfilFarmacia")}
      >
        <Text style={styles.editButtonText}>✏️ Editar datos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  label: { marginTop: 10, fontWeight: "600", fontSize: 14, color: "#555" },
  value: { fontSize: 16, marginBottom: 6 },
  editButton: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  editButtonText: { color: "#fff", fontWeight: "600", textAlign: "center", fontSize: 16 },
  logoutButton: {
    backgroundColor: "#C62828",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});

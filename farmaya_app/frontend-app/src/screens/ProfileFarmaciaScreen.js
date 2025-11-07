import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

export default function ProfileFarmaciaScreen({ navigation }) {
  const [farmacia, setFarmacia] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos reales desde el backend
  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        alert("Sesión expirada. Inicie sesión nuevamente.");
        navigation.replace("Login");
        return;
      }

      const response = await API.get("user/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFarmacia(response.data);
    } catch (error) {
      console.error("Error al cargar datos de la farmacia:", error.response?.data || error);
      alert("No se pudieron cargar los datos de la farmacia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (key, value) => {
    setFarmacia({ ...farmacia, [key]: value });
  };

  // 🔹 Guardar cambios en backend
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await API.put("user/update/", farmacia, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmacia(response.data);
      alert("Datos actualizados correctamente ✅");
    } catch (error) {
      console.error("Error al guardar cambios:", error.response?.data || error);
      alert("No se pudieron guardar los cambios.");
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    navigation.replace("Login");
  };

  if (loading) return <ActivityIndicator size="large" color="#1E88E5" style={{ flex: 1 }} />;
  if (!farmacia) return <Text>Error al cargar datos de farmacia</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Perfil de la Farmacia</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={farmacia.first_name || ""}
        onChangeText={(text) => handleChange("first_name", text)}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={farmacia.direccion || ""}
        onChangeText={(text) => handleChange("direccion", text)}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={farmacia.telefono || ""}
        onChangeText={(text) => handleChange("telefono", text)}
      />

      <Text style={styles.label}>Horarios</Text>
      <TextInput
        style={styles.input}
        value={farmacia.horarios || ""}
        onChangeText={(text) => handleChange("horarios", text)}
      />

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{farmacia.email}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleSave}>
        <Text style={styles.editButtonText}>💾 Guardar cambios</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
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

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditarPerfilFarmaciaScreen({ navigation }) {
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

  const handleSave = async () => {
    await AsyncStorage.setItem("user", JSON.stringify(farmacia));
    Alert.alert("✅ Guardado", "Datos actualizados correctamente");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {["nombre", "direccion", "telefono", "email", "horarios"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          value={farmacia[field]}
          onChangeText={(text) => setFarmacia({ ...farmacia, [field]: text })}
        />
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});

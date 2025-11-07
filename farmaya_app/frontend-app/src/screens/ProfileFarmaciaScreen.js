import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from '../theme/ThemeProvider';

export default function ProfileFarmaciaScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        style={[styles.themeToggle]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeIcon]}>{isDarkMode ? '🌞' : '🌙'}</Text>
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>🏥 Perfil de la Farmacia</Text>

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Nombre</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{farmacia.nombre}</Text>

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Dirección</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{farmacia.direccion}</Text>

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Teléfono</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{farmacia.telefono}</Text>

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Email</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{farmacia.email}</Text>

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Horarios</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{farmacia.horarios}</Text>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("EditarPerfilFarmacia")}
      >
        <Text style={[styles.editButtonText, { color: theme.colors.buttonText }]}>✏️ Editar datos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.secondary }]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: theme.colors.buttonText }]}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  label: { marginTop: 10, fontWeight: "600", fontSize: 14 },
  value: { fontSize: 16, marginBottom: 6 },
  editButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  editButtonText: { fontWeight: "600", textAlign: "center", fontSize: 16 },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutButtonText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  themeIcon: {
    fontSize: 22,
  },
});

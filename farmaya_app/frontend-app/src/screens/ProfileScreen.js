import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function ProfileScreen( {navigation}) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  const handleSave = async () => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    alert('Perfil actualizado');
  };

  const handleLogout = async () => {
    navigation.replace("Login");
  };

  if (!user) return <Text style={{ color: theme.colors.text }}>Cargando...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
              style={[styles.themeToggle, { /* mantiene posición, color dinámico */ }]}
              onPress={toggleTheme}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '🌞' : '🌙'}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.colors.text }]}>Perfil</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        value={user.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        value={user.email}
        editable={false}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        value={user.direccion}
        onChangeText={(text) => handleChange('direccion', text)}
        placeholder="Dirección"
        placeholderTextColor={theme.colors.textSecondary}
      />
      <Text style={{ color: theme.colors.text, marginBottom: 12 }}>Rol: {user.rol}</Text>

      <Button title="Guardar cambios" onPress={handleSave} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 },
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
  logoutButton: {
    backgroundColor: "#C62828",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});

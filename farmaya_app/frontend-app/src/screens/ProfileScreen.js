import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
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

  if (!user) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TextInput
        style={styles.input}
        value={user.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        value={user.email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        value={user.direccion}
        onChangeText={(text) => handleChange('direccion', text)}
        placeholder="Dirección"
      />
      <Text>Rol: {user.rol}</Text>

      <Button title="Guardar cambios" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert, ActivityIndicator } from 'react-native';
import API from '../api/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingrese un email válido');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      // 🔹 Petición al backend (JWT login)
      const response = await API.post('login/', { email, password });
      const { access, refresh } = response.data;

      // 🔹 Guardar tokens
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      // 🔹 Obtener datos del usuario autenticado
      const userResponse = await API.get('usuarios/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });

      const user = userResponse.data;
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('✅ Inicio de sesión exitoso');

      // 🔹 Redirección según tipo de usuario
      if (user.tipo_usuario === 'farmacia') {
        navigation.replace('HomeFarmacia');
      } else if (user.tipo_usuario === 'repartidor') {
        navigation.replace('HomeRepartidor');
      } else {
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error durante el login:', error.response?.data || error);
      if (error.response?.status === 401) {
        Alert.alert('Credenciales incorrectas', 'Email o contraseña inválidos.');
      } else {
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ marginVertical: 15 }} />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} color="#1E88E5" />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tenés cuenta? Registrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1E88E5' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  link: { color: '#1E88E5', textAlign: 'center', marginTop: 15, fontSize: 14 },
});

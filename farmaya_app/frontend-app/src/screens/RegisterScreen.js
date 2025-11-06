import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [direccion, setDireccion] = useState('');
  const [horarios, setHorarios] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // 🔹 Petición al backend para registrar
      const response = await API.post('register/', {
        nombre,
        email,
        password,
        tipo_usuario: rol, // 👈 coincide con el backend
        direccion,
        horarios,
      });

      console.log('✅ Usuario registrado:', response.data);

      // 🔹 Luego de registrarse, login automático (opcional)
      const loginResponse = await API.post('login/', { email, password });
      const { access, refresh } = loginResponse.data;

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      // 🔹 Obtener datos del usuario recién creado
      const userResponse = await API.get('usuarios/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });

      const user = userResponse.data;
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('✅ Registro exitoso', 'Sesión iniciada correctamente.');

      // 🔹 Redirigir según tipo de usuario
      if (user.tipo_usuario === 'farmacia') {
        navigation.replace('HomeFarmacia');
      } else if (user.tipo_usuario === 'repartidor') {
        navigation.replace('HomeRepartidor');
      } else {
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error.response?.data || error);
      Alert.alert(
        'Error',
        error.response?.data?.detail ||
          'No se pudo completar el registro. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Selecciona tu rol</Text>
      <Picker
        selectedValue={rol}
        onValueChange={(itemValue) => setRol(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Cliente" value="cliente" />
        <Picker.Item label="Farmacia" value="farmacia" />
        <Picker.Item label="Repartidor" value="repartidor" />
      </Picker>

      {rol === 'farmacia' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Dirección de la farmacia"
            value={direccion}
            onChangeText={setDireccion}
          />
          <TextInput
            style={styles.input}
            placeholder="Horarios de atención"
            value={horarios}
            onChangeText={setHorarios}
          />
        </>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ marginVertical: 10 }} />
      ) : (
        <Button
          title="Registrarme"
          onPress={handleRegister}
          color="#1E88E5"
          disabled={loading}
        />
      )}

      <Text style={styles.link} onPress={() => navigation.replace('Login')}>
        ¿Ya tenés cuenta? Iniciá sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});

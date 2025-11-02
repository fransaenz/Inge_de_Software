import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Validar Email y Contraseña
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };


  const handleLogin = async () => {
    // Validaciones antes de intentar el login
    if (!email.trim() || !password.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    if (!validatePassword(password)) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          // Guardar el estado de la sesión
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            // No guardar la contraseña en la sesión
          }));
          
          alert('Inicio de sesión exitoso');
          if (user.rol === 'farmacia') {
            navigation.replace('HomeFarmacia');
          } else if (user.rol === 'repartidor') {
            navigation.replace('HomeRepartidor');
          } else {
            navigation.replace('Home'); // usuario normal
          }
        } else {
          alert('Email o contraseña incorrectos');
        }
      } else {
        alert('No hay usuarios registrados');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Ocurrió un error al iniciar sesión');
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
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Ingresar" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Register')}
      >
        ¿No tenés cuenta? Registrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  link: { color: 'blue', textAlign: 'center', marginTop: 10 },
});

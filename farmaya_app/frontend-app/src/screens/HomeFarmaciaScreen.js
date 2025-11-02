import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeFarmaciaScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('Farmacia');

  useEffect(() => {
    const loadUserAndConfigureHeader = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        let name = 'Farmacia';
        if (stored) {
          const user = JSON.parse(stored);
          name = user.nombre || (user.email ? user.email.split('@')[0] : 'Farmacia');
        }
        setDisplayName(name);

        navigation.setOptions({
          headerTitle: () => <Text style={styles.headerTitle}>🏥 {displayName}</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileFarmacia')}
              style={styles.headerProfileButton}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          ),
        });
      } catch (e) {
        console.error('Error cargando farmacia:', e);
      }
    };

    loadUserAndConfigureHeader();
  }, [navigation, displayName]);

  return (
  <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PedidosFarmacia')}
        >
          <Text style={styles.cardText}>📦 Pedidos Recibidos</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.replace('HomeFarmacia')}>
        <Text style={styles.footerText}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('PedidosFarmacia')}>
        <Text style={styles.footerText}>Pedidos</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  headerProfileButton: { marginRight: 8, padding: 6 },
  profileIcon: { fontSize: 22 },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  cardText: { fontSize: 15, textAlign: 'center', color: '#333' },

  footer: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, color: '#333' },
});

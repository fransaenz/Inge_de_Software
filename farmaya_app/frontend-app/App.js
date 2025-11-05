import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeFarmaciaScreen from './src/screens/HomeFarmaciaScreen';
import HomeRepartidorScreen from './src/screens/HomeRepartidorScreen';
import ProfileFarmaciaScreen from './src/screens/ProfileFarmaciaScreen';
import PedidosFarmaciaScreen from './src/screens/PedidosFarmaciaScreen';
import EditarPerfilFarmaciaScreen from "./src/screens/EditarPerfilFarmaciaScreen";
import PedidoActivoScreen from "./src/screens/PedidoActivoScreen";
import { ThemeProvider } from './src/theme/ThemeProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="HomeFarmacia" component={HomeFarmaciaScreen} />
          <Stack.Screen name="HomeRepartidor" component={HomeRepartidorScreen} />
          <Stack.Screen name="ProfileFarmacia" component={ProfileFarmaciaScreen} />
          <Stack.Screen name="PedidosFarmacia" component={PedidosFarmaciaScreen} />
          <Stack.Screen name="EditarPerfilFarmacia" component={EditarPerfilFarmaciaScreen} />
          <Stack.Screen name="PedidoActivo" component={PedidoActivoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}


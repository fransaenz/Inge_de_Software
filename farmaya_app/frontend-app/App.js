import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditarPerfilFarmaciaScreen from "./src/screens/EditarPerfilFarmaciaScreen";
import HomeFarmaciaScreen from './src/screens/HomeFarmaciaScreen';
import HomeRepartidorScreen from './src/screens/HomeRepartidorScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PedidoActivoScreen from "./src/screens/PedidoActivoScreen";
import PedidosFarmaciaScreen from './src/screens/PedidosFarmaciaScreen';
import ProfileFarmaciaScreen from './src/screens/ProfileFarmaciaScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { ThemeProvider } from './src/theme/ThemeProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: '' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft: () => null, gestureEnabled: false}} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '', }} />
          <Stack.Screen name="HomeFarmacia" component={HomeFarmaciaScreen} options={{headerLeft: () => null, gestureEnabled: false}} />
          <Stack.Screen name="HomeRepartidor" component={HomeRepartidorScreen} options={{headerLeft: () => null, gestureEnabled: false}} />
          <Stack.Screen name="ProfileFarmacia" component={ProfileFarmaciaScreen} options={{title: ''}}/>
          <Stack.Screen name="PedidosFarmacia" component={PedidosFarmaciaScreen} options={{title: ''}}/>
          <Stack.Screen name="EditarPerfilFarmacia" component={EditarPerfilFarmaciaScreen} options={{title: ''}}/>
          <Stack.Screen name="PedidoActivo" component={PedidoActivoScreen} options={{title: ''}} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}


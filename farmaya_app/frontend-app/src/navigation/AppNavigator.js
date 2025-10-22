import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Perfil" component={ProfileScreen} />
        <Stack.Screen name="EditarPerfil" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

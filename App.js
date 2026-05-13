import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ScanScreen from './src/screens/ScanScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerStyle:{backgroundColor:'#085041'}, headerTintColor:'#E1F5EE', headerTitleStyle:{fontWeight:'700'} }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:'SonoAI',headerBackVisible:false}} />
          <Stack.Screen name="Scan" component={ScanScreen} options={{title:'New Scan'}} />
          <Stack.Screen name="Result" component={ResultScreen} options={{title:'AI Results'}} />
          <Stack.Screen name="History" component={HistoryScreen} options={{title:'Scan History'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

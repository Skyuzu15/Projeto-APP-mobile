import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import CreateLoad from './src/screens/CreateLoad';
import TransferLoad from './src/screens/TransferLoad';
import ReceiveLoad from './src/screens/ReceiveLoad';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="CreateLoad" component={CreateLoad} />
            <Stack.Screen name="TransferLoad" component={TransferLoad} />
            <Stack.Screen name="ReceiveLoad" component={ReceiveLoad} />
          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </AuthProvider>
  );
}
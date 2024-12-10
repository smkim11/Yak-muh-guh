import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Medication from './Medication';
import History from './History';
import { MedicationProvider } from './context/MedicationContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <MedicationProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Medication" component={Medication} />
          <Tab.Screen name="History" component={History} />
        </Tab.Navigator>
      </NavigationContainer>
    </MedicationProvider>
  );
}

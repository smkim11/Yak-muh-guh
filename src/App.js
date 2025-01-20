import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Home from './Home';
import Medication from './Medication';
import History from './History';
import { MedicationProvider } from './context/MedicationContext';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <MedicationProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#778bdd'},
            headerTitleStyle: {
              color: 'white', 
              fontSize: 26, 
              fontWeight: 'bold'
            },
            tabBarStyle: { backgroundColor: '#778bdd' }, 
            tabBarActiveTintColor: 'white', 
            tabBarInactiveTintColor: '#afafaf',
            tabBarLabelStyle: { fontWeight: 'bold' }, 
          }}
        >
          <Tab.Screen
            name="목록" component={Home}
            options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="추가" component={Medication}
            options={{ tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="기록" component={History}
            options={{tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MedicationProvider>
  );
}

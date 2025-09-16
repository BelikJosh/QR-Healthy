import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Crear_Paciente from './Pacientes';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BusquedaQR from './BusquedaQR';

const Tab = createBottomTabNavigator();

function Inicio() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: '#002851',
            headerStyle: {

                backgroundColor: '#002851',
            },
            headerTitleStyle: {
                color: 'white',
            },
            headerTintColor: '#fff'
        }}>


            <Tab.Screen 
            name="Crear_Paciente" 
            component={Crear_Paciente} 
            options={{
                tabBarIcon:() =>(
                    <MaterialIcons name="account-circle" size={24} color="#002851" />
                )
            }}
            />

            <Tab.Screen
             name="BusquedaQR"
              component={BusquedaQR}
              options={{
                tabBarIcon: ()=>(
                <MaterialIcons name="account-circle" size={24} color="#002851" />

                )

              }}
              />
            
        </Tab.Navigator>

    )
};

export default Inicio


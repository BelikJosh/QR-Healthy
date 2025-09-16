import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import Validar from './components/login';
import Crear_Usuario from './components/Crear_Usuario';
import Pacientes from './components/Pacientes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from 'expo-sqlite';
import { SvgXml } from 'react-native-svg';
import Toast from  'react-native-toast-message';
import Inicio from './components/Inicio';

const db = SQLite.openDatabase('qr.db');



interface User {
  id: number;
  nickname: string;
  password: string;
}
const Stack = createNativeStackNavigator();


export default function App() {

  return (

    <NavigationContainer>

      <GluestackUIProvider config={config}>

        <Stack.Navigator screenOptions={{
          headerStyle: {

            backgroundColor: '#011838',

          },

          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',

          }, headerTintColor: '#fff',
          

        }}>

          <Stack.Screen name="login" component={Validar} />
          <Stack.Screen name="Crear" component={Crear_Usuario} />
          <Stack.Screen name="Pacientes" component={Pacientes} />
          <Stack.Screen name="Inicio" component={Inicio}/>

        </Stack.Navigator>

      </GluestackUIProvider>
     
    
      
    </NavigationContainer>);


};


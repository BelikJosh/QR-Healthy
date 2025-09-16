import { Image, ScrollView } from '@gluestack-ui/themed';

import { Center, Icon, Link, LinkText } from '@gluestack-ui/themed';
import { ButtonIcon, ButtonGroup, AddIcon, InfoIcon, ButtonSpinner, ArrowUpIcon, Heading, Text, HStack, VStack, ThreeDotsIcon } from '@gluestack-ui/themed';
import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText, Input, InputField, Button, ButtonText, AlertCircleIcon, CheckboxGroup, Checkbox, Box, Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel, CircleIcon } from '@gluestack-ui/themed';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { useNavigation } from '@react-navigation/native';
import Crear_Usuario from './Crear_Usuario';
import * as SQLite from 'expo-sqlite';
import Pacientes from './Pacientes';
import Toast from 'react-native-toast-message';
import Inicio from './Inicio';
import { Ionicons } from '@expo/vector-icons';


const db = SQLite.openDatabase('qr4.db');

const eliminarBaseDeDatos = () => {
    const dbName = 'qr4.db'; // Nombre de la base de datos
    
    db.transaction(tx => {
      tx.executeSql(
        `PRAGMA writable_schema = 1;
         DELETE FROM sqlite_master WHERE type='table';
         PRAGMA writable_schema = 0;
         VACUUM;`,
        [],
        () => {
          console.log('Base de datos eliminada correctamente');
        },
        error => {
          console.log('Error al eliminar la base de datos', error);
        }
      );
    });
  };
  
  const crearBaseDeDatos = () => {
    const dbName = 'qr2.db'; // Nombre de la base de datos
  
    // Abre la base de datos (o la crea si no existe)
    const db = SQLite.openDatabase(dbName);
  
    // Transacción para crear la tabla "pacientes" si no existe
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS pacientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellidop TEXT, apellidom TEXT, fecha TEXT, tiposa TEXT, Num INTEGER,qr_code TEXT);',
        [],
        () => {
          console.log('Base de datos y tabla pacientes creadas correctamente');
        },
        error => {
          console.log('Error al crear la tabla pacientes', error);
        }
      );
    });
  };
  
const Validar = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
      };

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NO EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT ,   email TEXT ,password TEXT);');
        }, error => console.log('Error en la transaccion', error));
    }, []);
    const login_valid = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM users WHERE email = ? AND password = ?;', [email, password], (_, {
                rows
            }) => {
                if (rows.length > 0) {
                    console.log('Inicio de sesión exitoso');
                    const users = rows.item(0);
                    Toast.show({
                        type: 'success',
                        text1: 'Inicio de sesión exitoso',
                        text2: `¡Bienvenido, ${users.email}!`,
                        visibilityTime: 10000
                    });
                    navigation.navigate("Inicio");
                } else {
                    console.log('Credenciales incorrectas');
                    Toast.show({
                        type: 'error',
                        text1: 'Inicio de sesión fallido',
                        text2: 'Por favor verifica tu Usuario y contraseña',
                        visibilityTime: 10000
                    });
                }
            });
        }, error => console.log('Error en la transacción', error));
    };
    return <ScrollView h="$80" w="$96" backgroundColor='white'>
        <Box borderColor='white' borderWidth={'$1'} p={'$1'} borderRadius={'$lg'} backgroundColor='white' alignItems='center' marginTop={"$12"}>

            <Text fontSize={"$2xl"} color='black' p={'$4'}>Bienvenidos</Text>
            <Box style={{ alignItems: 'center' }}>
                <Box style={{ borderRadius: 150, overflow: 'hidden', borderWidth: 2, borderColor: 'black', marginBottom: 40 }}>
            <Image
                size="2xl"
                source={
                require('../assets/img/Logo.jpg')   
                }
            />
            </Box>
            </Box>
            <FormControl size={"lg"} isDisabled={false} isRequired={true} >
                <FormControlLabel>
                    <FormControlLabelText>Usuario</FormControlLabelText>
                </FormControlLabel>
                <Input>
                    <InputField type="text" placeholder="Usuario" onChangeText={value => setEmail(value)} />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                        Agrega tu usuario
                    </FormControlErrorText>
                </FormControlError>


                <FormControl size={"lg"} isDisabled={false} isRequired={true}>

                    <FormControlLabel>
                        <FormControlLabelText>Contraseña</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder='Contraseña'
                onChangeText={value => setPassword(value)}
              />
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                onPress={toggleShowPassword}
              />
            </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            Ingresa tu contraseña por favor.
                        </FormControlHelperText>
                    </FormControlHelper>

                </FormControl>
            </FormControl>
            <Button action={"primary"} variant={"solid"} size={"lg"} isDisabled={false} marginTop={"$5"} bgColor='#002851' onPress={login_valid }>

                <ButtonText>
                    Iniciar
                </ButtonText>
                <Box marginTop={-800} marginRight={100}>
                    <Toast />
                </Box>
            </Button>


            <Text marginTop={"$4.5"}>Si no cuenta con un usuario y contraseña haga click en el siguiente link. </Text>

            <Link marginTop={"$2.5"} alignSelf='center' onPress={() => navigation.navigate("Crear")}>
                <LinkText>Nueva cuenta</LinkText>
            </Link>

        </Box>
    </ScrollView>;
};
export default Validar;
import { Center, Icon, Link, LinkText } from '@gluestack-ui/themed';
import { ButtonIcon, ButtonGroup, AddIcon, InfoIcon, ButtonSpinner, ArrowUpIcon, Heading, Text, HStack, VStack, ThreeDotsIcon } from '@gluestack-ui/themed';
import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText, Input, InputField, Button, ButtonText, AlertCircleIcon, CheckboxGroup, Checkbox, Box, Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel, CircleIcon } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';



const db = SQLite.openDatabase('qr4.db');

interface User {
  id: number;
  email: string;
  password: string;
}
function Crear_Usuario() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [UserId, setUserid] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
  const navigation = useNavigation();
  const [Users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT ,   email TEXT ,password TEXT);');
    }, error => console.log('Error en la transaccion', error));
    fetchUsers()
  }, []);



  const addUser = () => {
    if (password.length < 6) {
      console.log('Error: La contraseña debe tener al menos 6 caracteres');
      Toast.show({
        type: 'error',
        text1: 'Error al agregar usuario',
        text2: 'La contraseña debe tener al menos 6 caracteres',
        visibilityTime: 10000
      });
      return;
    } 
    if (!email.includes("@")) {
      console.log('Error: El correo electrónico es incorrecto');
      Toast.show({
        type: 'error',
        text1: 'Error al agregar usuario',
        text2: 'El correo electrónico es invalido',
        visibilityTime: 10000
      });
      return;
    }
    
  
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ?;',
        [email],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log('Error: El usuario ya existe');
            Toast.show({
              type: 'error',
              text1: 'Error al agregar usuario',
              text2: 'El correo ya existe, por favor elige otro correo',
              visibilityTime: 10000
            });
          } else {
            tx.executeSql('SELECT MAX(id) as maxId FROM users;', [], (_, { rows }) => {
              const maxId = rows.item(0).maxId || 0;
              const newId = maxId + 1;
  
              tx.executeSql(
                'INSERT INTO users (id, email, password) VALUES (?,?,?);',
                [newId, email, password],
                () => {
                  console.log('Usuario agregado correctamente');
                    tx.executeSql('UPDATE users SET id = id + 1 WHERE id > ?;', [newId], () => {
                    console.log('IDs actualizados correctamente');
                    Toast.show({
                      type: 'success',
                      text1: 'Usuario agregado',
                      text2: 'El usuario ha sido agregado correctamente',
                      visibilityTime: 10000
                    });
                  }, error => console.log('Error al actualizar IDs', error));
                },
                error => console.log('Error al agregar usuario', error)
              );
            });
          }
        },
        error => console.log('Error al verificar usuario', error)
      );
    }, error => console.log('Error en la transacción', error));
  };

  const fetchUsers = () => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM users", [], (_, {
        rows
      }) => {
        console.log(rows);
        const userList: User[] = [];
        for (let i = 0; i < rows.length; i++) {
          userList.push((rows.item(i) as User));
          console.log(rows);
        }
        setUsers(userList);
      });
    });
  };




  const deleteUser = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM users WHERE id = ?;', [UserId], (_, { rowsAffected }) => {
        if (rowsAffected > 0) {
          console.log('Usuario eliminado correctamente');
          Toast.show({
            type: 'success',
            text1: 'Usuario eliminado',
            text2: 'El usuario ha sido eliminado correctamente',
            visibilityTime: 10000
          });
        } else {
          console.log('No se encontró ningún usuario con ese ID');
          Toast.show({
            type: 'error',
            text1: 'Usuario no encontrado',
            text2: 'No se encontró ningún usuario con ese ID',
            visibilityTime: 10000
          });
        }
      });
    }, error => console.log('Error en la transacción', error));
  };
  
  return <Box borderColor='darkBlue200' borderWidth={'$1'} p={'$1'} borderRadius={'$lg'} backgroundColor='white' marginTop={"$24"} alignItems='center'>

    <Text fontSize={"$2xl"} color='black' p={'$4'}>Crear Usuario</Text>

    <FormControl size={"lg"} isDisabled={false} isRequired={true}>
      <FormControlLabel>
        <FormControlLabelText>Email</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField type="text" placeholder="Email" onChangeText={value => setEmail(value)} />
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
            Ingresa una contraseña
            con mas de 6 caracteres.
          </FormControlHelperText>
        </FormControlHelper>


        <Box>

          <Button action={"primary"} variant={"solid"} bgColor='#002851' size={"lg"} marginTop={20} onPress={addUser}>
            <ButtonText>Registrarse</ButtonText>
            <Box marginTop={-800} marginRight={100}>
              <Toast />
            </Box>
          </Button>

          <Link marginTop={"$2.5"} alignSelf='center' onPress={() => navigation.navigate("login")}>
            <LinkText>Regresar</LinkText>
          </Link>

        

        </Box>


        <FormControl size={"lg"} isDisabled={false} isRequired={true}>

        <FormControlLabel>
          <FormControlLabelText>Borrar Usuario</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField type="text" placeholder="Ingrese ID" onChangeText={value => setUserid(value)} />

        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            Ingresa una contraseña
            con mas de 6 caracteres.
          </FormControlHelperText>
        </FormControlHelper>
        <Button action={"primary"} variant={"solid"} bgColor='#002851' size={"lg"} marginTop={20} onPress={deleteUser}>
            <ButtonText>Eliminar</ButtonText>
            <Box marginTop={-800} marginRight={100}>
              <Toast />
            </Box>
          </Button>

</FormControl>
      </FormControl>
    </FormControl>

  </Box>;



}

export default Crear_Usuario
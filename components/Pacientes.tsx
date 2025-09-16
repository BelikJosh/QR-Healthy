import React, { useState, useEffect } from "react";
import { Box, Text, FormControl, FormControlLabel, FormControlLabelText, Input, InputField, Button, ButtonText, ScrollView, Alert, View } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { TextInput } from "react-native";
import QRCode from "react-native-qrcode-svg";

const db = SQLite.openDatabase('qr4.db');

interface Paciente {
  id: number;
  nombre: string;
  apellidop: string;
  apellidom: string;
  fecha: string;
  tiposa: string;
  Num: number;
  qr_code: string;
  enfermedades: string;
  alergias: string;
  direccionpa:string
  nombrecontacto:string;
  telefono: number;
  telefonoemergencia: number;
}

function CrearPaciente() {
  const [nombre, setNombre] = useState('');
  const [apellidop, setApellidop] = useState('');
  const [apellidom, setApellidom] = useState('');
  const [Fecha, setFecha] = useState('');
  const [TipoSangre, setTipoSangre] = useState('');
  const [enfermedades, setEnfermedades] = useState('');
  const [alergias, setAlergias] = useState('');
  const [direccionpa, setDireccionpa] = useState('');
  const [nombrecontacto, setNombrecontacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoemergencia, setEmergencia] = useState('');
  const [NumSeguro, setNumSeguro] = useState('');
  const [qrText, setQRText] = useState('');

  const [pacienteId, setPacienteId] = useState('');

  const navigation = useNavigation();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS pacientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellidop TEXT, apellidom TEXT, fecha TEXT, tiposa TEXT,enfermedades TEXT,alergias TEXT,direccionpa TEXT, nombrecontacto TEXT,telefono INTEGER ,telefonoemergencia INTEGER, Num INTEGER, qr_code TEXT);');
    }, (error: any) => console.log('Error en la transacción', error));
    fetchPacientes();
  }, []);
  const addPaciente = () => {
    if (!nombre || !apellidop || !NumSeguro) {
      console.log('Error: Por favor ingresa el nombre, apellido paterno y número de seguro social del paciente');
      Toast.show({
        type: 'error',
        text1: 'Error al agregar paciente',
        text2: 'Por favor ingresa el nombre, apellido paterno y número de seguro social del paciente',
        visibilityTime: 10000
      });
      return;
    }
  
    // Generar el código QR antes de agregar el paciente
    const qrCodeValue = NumSeguro; // Puedes cambiar esta lógica según sea necesario
  
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pacientes WHERE Num = ? OR (nombre = ? AND apellidop = ? AND apellidom = ?);',
        [NumSeguro, nombre, apellidop, apellidom],
        (_, { rows }) => {
          if (rows.length > 0) {
            const paciente = rows.item(0);
            if (paciente.Num === NumSeguro) {
              console.log('Error: El número de seguro social ya está registrado');
              Toast.show({
                type: 'error',
                text1: 'Error al agregar paciente',
                text2: 'El número de seguro social ya está registrado, por favor ingresa otro número',
                visibilityTime: 10000
              });
            } else {
              console.log('Error: El paciente ya existe');
              Toast.show({
                type: 'error',
                text1: 'Error al agregar paciente',
                text2: 'El paciente ya existe, por favor ingresa otro nombre y apellido',
                visibilityTime: 10000
              });
            }
          } else {
            tx.executeSql(
              'INSERT INTO pacientes (nombre, apellidop, apellidom, fecha, tiposa, enfermedades, alergias, direccionpa, nombrecontacto, telefono, telefonoemergencia, Num, qr_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
              [nombre, apellidop, apellidom, Fecha, TipoSangre, enfermedades, alergias, direccionpa, nombrecontacto, telefono, telefonoemergencia, NumSeguro, qrCodeValue],
              () => {
                console.log('Paciente agregado correctamente');
                Toast.show({
                  type: 'success',
                  text1: 'Paciente agregado',
                  text2: 'El paciente ha sido agregado correctamente',
                  visibilityTime: 10000
                })
                fetchPacientes();
              },
              (tx: any, error: any) => console.log('Error al agregar paciente', error)
            );
          }
        },
        (tx: any, error: any) => console.log('Error al verificar paciente', error)
      );
    }, (error: any) => console.log('Error en la transacción', error));
  };
  
  const fetchPacientes = () => {
    db.transaction(tx  => {
      tx.executeSql("SELECT * FROM pacientes", [], (_: any, { rows }: any) => {
        const pacientesList: Paciente[] = [];
        for (let i = 0; i < rows.length; i++) {
          pacientesList.push(rows.item(i));
        }
        setPacientes(pacientesList);
      });
    });
  };
  const updatePaciente = () => {
    if (!nombre || !apellidop || !NumSeguro) {
      console.log('Error: Por favor ingresa el nombre, apellido paterno y número de seguro social del paciente');
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar paciente',
        text2: 'Por favor ingresa el nombre, apellido paterno y número de seguro social del paciente',
        visibilityTime: 10000
      });
      return;
    }
  
    const qrCodeValue = NumSeguro; // Puedes cambiar esta lógica según sea necesario
  
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pacientes WHERE Num = ?;',
        [NumSeguro],
        (_, { rows }) => {
          if (rows.length === 0) {
            console.log('Error: El número de seguro social no existe');
            Toast.show({
              type: 'error',
              text1: 'Error al actualizar paciente',
              text2: 'El número de seguro social no existe',
              visibilityTime: 10000
            });
          } else {
            tx.executeSql(
              'UPDATE pacientes SET nombre = ?, apellidop = ?, apellidom = ?, fecha = ?, tiposa = ?, enfermedades = ?, alergias = ?, direccionpa = ?, nombrecontacto = ?, telefono = ?, telefonoemergencia = ?, qr_code = ? WHERE Num = ?;',
              [nombre, apellidop, apellidom, Fecha, TipoSangre, enfermedades, alergias, direccionpa, nombrecontacto, telefono, telefonoemergencia, qrCodeValue, NumSeguro],
              () => {
                console.log('Paciente actualizado correctamente');
                Toast.show({
                  type: 'success',
                  text1: 'Paciente actualizado',
                  text2: 'El paciente ha sido actualizado correctamente',
                  visibilityTime: 10000
                })
                fetchPacientes();
              },
              (tx: any, error: any) => console.log('Error al actualizar paciente', error)
            );
          }
        },
        (tx: any, error: any) => console.log('Error al verificar paciente', error)
      );
    }, (error: any) => console.log('Error en la transacción', error));
  };
  
  const eliminarTablaPacientes = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS pacientes;', [], (_: any, result: any) => {
        console.log('Tabla pacientes eliminada correctamente');
      }, (error) => {
        console.log('Error al eliminar la tabla pacientes', error);
      });
    });
  };

  const generateQRCode = () => {
    setQRText(NumSeguro);
  };

  const onChangeText = (value: any) => {
    setNumSeguro(value);
    setQRText(value); // Actualiza el texto del QR cuando cambia el número de seguro social
  };

  const deletePaciente = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM pacientes WHERE id = ?;', [pacienteId], (_: any, { rowsAffected }: any) => {
        if (rowsAffected > 0) {
          console.log('Paciente eliminado correctamente');
          fetchPacientes();
          Toast.show({
            type: 'success',
            text1: 'Paciente eliminado',
            text2: 'El paciente ha sido eliminado correctamente',
            visibilityTime: 10000
          });
        } else {
          console.log('No se encontró ningún paciente con ese ID');
          Toast.show({
            type: 'error',
            text1: 'Paciente no encontrado',
            text2: 'No se encontró ningún paciente con ese ID',
            visibilityTime: 10000
          });
        }
      });
    }, (error: any) => console.log('Error en la transacción', error));
  };

  return (
    <ScrollView h="$80" w="$96">
      <Box borderColor='white' borderWidth={'$1'} p={'$1'} borderRadius={'$lg'} backgroundColor='white' marginTop={"$2"} alignItems='center'>
        <Text fontSize={"$2xl"} color='black' p={'$4'}>Agregar Paciente</Text>
        <FormControl size={"lg"} isDisabled={false} isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>Nombre</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Nombre" onChangeText={value => setNombre(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Apellido Paterno</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Paterno" onChangeText={value => setApellidop(value)} />
          </Input>

          <FormControlLabel>
            <FormControlLabelText>Apellido Materno</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Materno" onChangeText={value => setApellidom(value)} />
          </Input>
          
          <FormControlLabel>
            <FormControlLabelText>Fecha de nacimiento</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Fecha" onChangeText={value => setFecha(value)} />
          </Input>
          
          <FormControlLabel>
            <FormControlLabelText>Tipo de sangre</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Tipo de sangre" onChangeText={value => setTipoSangre(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Enfermedades</FormControlLabelText>
          </FormControlLabel>
          
          <Input>
            <InputField type="text" placeholder="Enfermedades" onChangeText={value => setEnfermedades(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Alergias</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Alergias" onChangeText={value => setAlergias(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Direccion del paciente</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Direccion" onChangeText={value => setDireccionpa(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Nombre del contacto</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Nombre del contacto" onChangeText={value => setNombrecontacto(value)} />
          </Input>
          <FormControlLabel>
            <FormControlLabelText>Telefono</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Telefono" onChangeText={value => setTelefono(value)} />
          </Input>
          
          <FormControlLabel>
            <FormControlLabelText>Telefono de emergencia</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Telefono de emergencia" onChangeText={value => setEmergencia(value)} />
          </Input>
          

          <FormControlLabel>
            <FormControlLabelText>Numero de seguro social</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Numero de seguro social" onChangeText={onChangeText} />
          </Input>
          {qrText ? (
            <View style={{ marginTop: 20 }}>
              <QRCode value={qrText} size={200} />
            </View>
          ) : null}
          
          <Button action={"primary"} variant={"solid"} bgColor='#002851' size={"lg"} marginTop={20} onPress={addPaciente}>
            <ButtonText>Agregar Paciente</ButtonText>
          </Button>
          <FormControlLabel>
            <FormControlLabelText>Borrar Paciente</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Ingrese ID" onChangeText={value => setPacienteId(value)} />
          </Input>
          <Button action={"primary"} variant={"solid"} bgColor='#002851' size={"lg"} marginTop={20} onPress={deletePaciente}>
            <ButtonText>Eliminar</ButtonText>
          </Button>
        </FormControl>
      </Box>
    </ScrollView>
  );
}

export default CrearPaciente;

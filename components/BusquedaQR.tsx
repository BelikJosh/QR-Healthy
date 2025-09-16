import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';
import { Box } from '@gluestack-ui/themed';
import { Image, ScrollView } from '@gluestack-ui/themed';

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

function BusquedaQR() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [pacienteData, setPacienteData] = useState<Paciente | null>(null);
  const [registroNoEncontrado, setRegistroNoEncontrado] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannedData(data);

    // Buscar en la base de datos utilizando el número de seguro social escaneado
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pacientes WHERE Num = ?;',
        [data],
        (_, { rows }) => {
          if (rows.length > 0) {
            // Si se encuentra un paciente, actualizar el estado con los detalles del paciente
            setPacienteData(rows.item(0));
            setRegistroNoEncontrado(false);
          } else {
            // Si no se encuentra ningún paciente, mostrar un mensaje
            setPacienteData(null);
            setRegistroNoEncontrado(true);
          }
        },
        (_, error) => {
          console.log('Error al buscar paciente en la base de datos:', error);
          setPacienteData(null);
          setRegistroNoEncontrado(true);
        }
      );
    });
  };

  const openCamera = () => {
    setCameraOpen(true);
    setScanned(false);
    setScannedData(null);
    setPacienteData(null);
    setRegistroNoEncontrado(false);
  };

  const closeCamera = () => {
    setCameraOpen(false);
  };

  const scanQRCode = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de la cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraOpen ? (
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject, styles.cameraPreview]}
          />
          <View style={styles.cameraOverlay}>
            <Text style={styles.overlayText}>Posicione el QR dentro del marco</Text>
          </View>
          <Button title="Cerrar cámara" onPress={closeCamera} />
        </View>
      ) : (
        <View  style={styles.buttonContainer }>
          <Button title="Escanear" onPress={openCamera} />
        </View>
      )}
      {scanned && (
        <View style={styles.dataContainer}>
          {registroNoEncontrado ? (
            <Text style={styles.dataText}>Registro no encontrado</Text>
          ) : pacienteData ? (
            <>
<Box style={{ borderRadius: 150, overflow: 'hidden', borderWidth: 2, borderColor: 'black', marginBottom: 10 }}>
            <Image
                size="xl"
                source={
                  require('../assets/img/Logo.jpg')
                }
            />
            </Box>

              <Text style={styles.dataText}>Paciente encontrado:</Text>
              <Text style={styles.dataText}>Nombre: {pacienteData.nombre}</Text>
              <Text style={styles.dataText}>Apellido Paterno: {pacienteData.apellidop}</Text>
              <Text style={styles.dataText}>Apellido Materno: {pacienteData.apellidom}</Text>
              <Text style={styles.dataText}>Fecha de Nacimiento: {pacienteData.fecha}</Text>
              <Text style={styles.dataText}>Tipo de Sangre: {pacienteData.tiposa}</Text>
              <Text style={styles.dataText}>Enfermedades: {pacienteData.enfermedades}</Text>
              <Text style={styles.dataText}>Alergias: {pacienteData.alergias}</Text>
              <Text style={styles.dataText}>Direccion del paciente: {pacienteData.direccionpa}</Text>
              <Text style={styles.dataText}>Nombre del contacto: {pacienteData.nombrecontacto}</Text>
              <Text style={styles.dataText}>Telefono: {pacienteData.telefono}</Text>
              <Text style={styles.dataText}>Telefono de emergencia: {pacienteData.telefonoemergencia}</Text>              
              <Text style={styles.dataText}>Numero de seguro social: {pacienteData.Num}</Text>
              {/* Agrega más detalles del paciente aquí si es necesario */}
            </>
          ) : (
            <Text style={styles.dataText}>No se encontró ningún paciente con el número de seguro social escaneado</Text>
          )}
          <Button  title="Escanear de nuevo" onPress={scanQRCode} />
        </View>
      )}
    </View>
  );
}

export default BusquedaQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    
  },
  buttonContainer: {
    margin: 20,
  },
  dataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 7, 7, 0.94)',
    padding: 45,
    alignItems: 'center',
    
  },
  dataText: {
    color: '#fff',
    fontSize: 18,
  },
button:{
  backgroundColor: '#002851'
}

});

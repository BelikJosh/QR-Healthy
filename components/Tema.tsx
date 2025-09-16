// App.js

import React, { useState } from 'react';
import { Provider as PaperProvider, DefaultTheme, MD3DarkTheme, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import SecondaryScreen from './SecondaryScreen';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const theme = isDarkTheme ? isDarkTheme : DefaultTheme;

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Button onPress={toggleTheme}>Cambiar Tema</Button>
        <View style={styles.content}>
          <SecondaryScreen isDarkTheme={isDarkTheme} />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

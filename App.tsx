import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import InicialPage from './src/pages/InicialPage';
import GamePage from './src/pages/GamePage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('InicialPage'); // Estado para controlar a tela atual

  const navigateTo = (screen) => {
    setCurrentScreen(screen); // Muda a tela
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'InicialPage' && <InicialPage navigateTo={navigateTo} />}
      {currentScreen === 'GamePage' && <GamePage navigateTo={navigateTo} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

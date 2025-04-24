
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { NativeBaseProvider, extendTheme } from 'native-base';
import 'react-native-gesture-handler';
import 'react-native-reanimated'; // ✅ MUST be first

import store from './source/redux/NativeBaseProvider-reducer/NativeBaseProvider.reducer';
import MainStackNavigator from './source/navigation/main-stack-navigator/main-stack-navigator.navigation.js';

// Create a theme (you can leave it empty to use defaults)
const theme = extendTheme({});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}

export default App;

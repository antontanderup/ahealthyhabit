import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './src/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppComponent from './src/components/App';
import './src/i18n';

export default function Root() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppComponent />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

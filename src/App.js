import React, {Component, useEffect} from 'react';
import {LogBox, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Routing from './Routing';
import colors from './utils/colors';
LogBox.ignoreAllLogs(true);
StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor(colors.transparent);
StatusBar.setBarStyle('dark-content');

export default App = props => {
  useEffect(() => {
    setTimeout(()=>{
      SplashScreen.hide();
    },2500)
  }, []);
  return <Routing />;
};

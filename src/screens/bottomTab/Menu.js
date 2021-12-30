import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
//Components
import Button from '../../components/Button';
//Utils
import colors from '../../utils/colors';
const Menu = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onPress={() => {
          AsyncStorage.clear();
          props.navigation.dispatch(StackActions.replace('Auth'));
        }}
        textContainer={styles.textContainer}
        title={'Sign Out'}
        ButtonStyle={styles.button}
      />
    </View>
  );
};

export default Menu;
const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '55%',
  },
});

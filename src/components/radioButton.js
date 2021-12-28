import React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Colors from '../utils/colors';
const RadioButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <View style={[styles.buttonStyle, {backgroundColor: props.active ? Colors.darkOrange : Colors.white}]} />
      <Text style={styles.textStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
  },
  buttonStyle: {
    height: 15,
    width: 15,
    borderWidth: 2,
    borderRadius: 7.5,
    borderColor: Colors.white,
    
  },
  textStyle: {
    marginLeft: 20,
    fontSize: 16,
    color: Colors.white,
  },
});

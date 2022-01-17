import React from 'react';
import {Image, Text, StyleSheet, View, TextInput} from 'react-native';
import Colors from '../utils/colors';
const Input = props => {
  return (
    <TextInput
      secureTextEntry={props.secureTextEntry}
      style={[styles.container, props.InputStyle]}
      placeholder={props.Placeholder}
      placeholderTextColor={Colors.grey}
      onChangeText={props.onChangeText}
      value={props.value}
      keyboardType={props.keyboardType}
      editable={props.editable}
      maxLength={props.maxLength}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor: Colors.darkOrange,
    color:Colors.black,
    textAlign:"center",
    fontSize:18
  },
});

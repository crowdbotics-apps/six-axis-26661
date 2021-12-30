import React from 'react';
import {Image, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import colors from '../utils/colors';
const Button = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.container, props.ButtonStyle]}>
      <View style={props.imageContainer}>
      {props.Icon&&<Image resizeMode="contain" style={[styles.Icon,props.IconStyle]} source={props.Icon} />}
      </View>
      <View style={[styles.textView,props.textContainer]}>
        <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    backgroundColor: colors.darkOrange,
    // paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Icon: {
    height: 40,
    width: 40,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    fontWeight:"bold"
  },
  textView:{width: '100%'}
});

import React from 'react';
import {Image, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import colors from '../utils/colors';
import {Utils} from '../utils/Dimensions';

const ButtonCard = props => {
    const {image,ButtonStyle,onPress,imageContainer,title} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, ButtonStyle]}>
      <View style={[styles.ImageContainer,imageContainer]}>
        <Image resizeMode='contain' style={styles.imageStyle} source={image} />
      </View>
      {title&&<Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default ButtonCard;

const styles = StyleSheet.create({
  container: {
    height: Utils.resHeight(150),
    width: Utils.resHeight(150),
    // flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: Utils.resHeight(1.5),
    borderRadius: Utils.resHeight(15),
    backgroundColor: colors.darkOrange,
    marginVertical: Utils.resHeight(0.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  ImageContainer: {
    height: Utils.resHeight(70),
    width: Utils.resHeight(70),
  },
  imageStyle:{
      height:"100%",
      width:"100%",
      tintColor:colors.white
  },
  title:{
    marginTop:Utils.resHeight(12),
    color:colors.white,
    fontSize:Utils.resHeight(16),
    fontWeight:"bold"
  }
});

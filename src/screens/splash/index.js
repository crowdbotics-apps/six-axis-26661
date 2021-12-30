import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions} from '@react-navigation/native';
//Components
//Images
import images from '../../Assets';
import colors from '../../utils/colors';
const Splash = ({navigation}) => {
  useEffect(() => {
   navigateTo()
  }, []);

  const navigateTo = async()=>{
    let authToken = await AsyncStorage.getItem("authToken")
    // const timer = setTimeout(() => {
      if(authToken){
        navigation.dispatch(StackActions.replace('BottonStack'));
      } else {
      navigation.dispatch(StackActions.replace('Auth'));
    }
    // }, 2500);
    // return () => clearTimeout(timer);
  }

  return null;
     // (
    // <View style={styles.container}>
    //   <LinearGradient
    //     start={{x: 1.2, y: 0}}
    //     end={{x: 0, y: 1}}
    //     colors={['#F9B041', '#BE202E']}
    //     style={styles.linearGradient}>
    //     <ImageBackground
    //       style={styles.imageStyle}
    //       source={images.splashBackground}>
          
    //     </ImageBackground>
    //     <View style={{position:"absolute",top:0,left:0,right:0,bottom:0}}>
    //       <View style={{flex:1}}/>
    //       <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    //     <Image resizeMode="contain" style={{height: 50, width: "80%"}} source={images.whiteLogo} />
    //       <Text style={{width:"80%",textAlign:"center",fontSize:16,marginTop:40,color:colors.white}} >
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
    //       </Text>
    //       </View>
    //       </View>
    //   </LinearGradient>
    // </View>
  // );
};
export default Splash;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {height: '100%', width: '100%', opacity: 0.2,justifyContent:"center",alignItems:"center"},
});

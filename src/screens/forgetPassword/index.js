import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableHighlight,
  Keyboard,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
//API's
import {forgetPasswordApi} from '../../API/methods/forgetPassword';
//Components
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLoading from '../../components/AppLoading';
//Images
import images from '../../Assets';
//Utils
import colors from '../../utils/colors';
import {Utils} from '../../utils/Dimensions';
const ForgetPassword = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(true);
  const [loading, setLoading] = useState(false);
  //SignIn States
  const [email, setEmail] = useState('');
  const EmailVerificationRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const checkField = () => {
      if (email == "")
      return alert("Please enter email")
    if (!EmailVerificationRegex.test(email))
      return alert('Please enter valid email');
    sendEmail();
  };

  const sendEmail = async () => {
    setLoading(true);
    let payload = {
      email,
    };
    forgetPasswordApi(payload)
      .then(response => {
        console.log(
          '🚀 ~ file: index.js ~ line 60 ~ signInAPI ~ response',
          response,
        );
        setLoading(false);
        if (response.status == 200) {
            navigation.goBack();
            Alert.alert('SORFIT', response.data.detail, [
                {
                  text: 'OK',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'ok',
                },
              ]);
        }
        
      })
      .catch(err => {
        Alert.alert('SORFIT', `Email doesn't exist`, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        // alert('Invalid credentials');
        console.log('🚀 ~ file: index.js ~ line 63 ~ signUp ~ err', err);
        setLoading(false);
      });
  };

  return (
    <TouchableHighlight
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{flex: 1}}>
      <View style={styles.container}>
        {AppLoading.renderLoading(loading)}
        
        <View style={styles.logoContainer}>
            <View style={{flex:1,justifyContent:"center"}}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
          <Image style={styles.backArrow} source={images.arrowDown} />
        </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
          <Image
            resizeMode="contain"
            style={styles.logoStyle}
            source={images.gradianLogo}
          />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.tabShiftContainer}>
            <View
              style={[
                styles.authButton,
                {
                  borderBottomColor: activeTab
                    ? colors.darkOrange
                    : colors.grey,
                },
              ]}>
              <Text
                style={[
                  styles.authButtonText,
                  {color: activeTab ? colors.darkOrange : colors.grey},
                ]}>
                Forget Password
              </Text>
            </View>

          </View>
            <View style={styles.inputFieldsContainer}>
                <View style={{flex:1,width:"100%",justifyContent:"center"}}>
              <Input
                onChangeText={setEmail}
                value={email}
                Placeholder="E-mail"
                keyboardType="email-address"
                InputStyle={{marginBottom:Utils.resHeight(50)}}
              />
              <Button
                onPress={() => checkFieldSignIn()}
                textContainer={styles.textContainer}
                title={'Send email'}
                onPress={()=>checkField()}
              />
              </View>
              <View style={{flex:1}}>
              
              </View>
            </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default ForgetPassword;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoStyle: {
    height: Utils.resHeight(35),
    width: '80%',
    alignSelf:"center"
  },
  authButton: {
    borderBottomWidth: 2,
    height: Utils.resHeight(80),
    justifyContent: 'center',
    paddingHorizontal: Utils.resWidth(170),
    borderBottomColor: colors.darkOrange,
  },
  contentContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  tabShiftContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  authButtonText: {
    color: colors.darkOrange,
    fontSize: Utils.resHeight(30),
  },
  inputFieldsContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Utils.resHeight(50),
  },
  socialButton: {
    height: Utils.resHeight(50),
    width: '47%',
    backgroundColor: colors.socialBlue,
  },
  socialButtonText: {
    fontSize: Utils.resHeight(14),
  },
  socialButtonIcon: {
    height: Utils.resHeight(40),
    width: Utils.resHeight(40),
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialImageContainer: {
    height: Utils.resHeight(50),
    width: Utils.resHeight(50),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: `${colors.grey}60`,
    borderWidth: Utils.resHeight(1),
  },
  socialButtonTextContainer: {
    width: '77%',
    alignItems: 'center',
  },
  passwordText: {
    fontSize: Utils.resHeight(24),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Utils.resHeight(20),
  },
  inputField: {
    width: '46%',
  },
  backArrow: {
    height: Utils.resHeight(30),
    width: Utils.resHeight(30),
    tintColor: colors.darkOrange,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
  },
  backArrowContainer:{
    height: Utils.resHeight(30),
    width: Utils.resHeight(30),
    marginLeft:10
  }
});

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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {StackActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppleButton,appleAuth} from '@invertase/react-native-apple-authentication';
//API's
import {signupAPI, signInAPI} from '../../API/methods/auth';
//Components
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLoading from '../../components/AppLoading';
//Images
import images from '../../Assets';
//Utils
import colors from '../../utils/colors';
import {Utils} from '../../utils/Dimensions';
const Auth = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(true);
  const [loading, setLoading] = useState(false);
  //SignIn States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  //SignUp States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const EmailVerificationRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const checkField = () => {
    if (!firstName) return alert('Please enter your First name');
    if (!lastName) return alert('Please enter your Last name');
    if (!height) return alert('Please enter your height');
    if (!weight) return alert('Please enter your weight');
    if (!signUpEmail) return alert('Please enter your email');
    if (!EmailVerificationRegex.test(signUpEmail))
      return alert('Please enter valid email');
    if (!signUpPassword) return alert('Please enter your password');
    if (signUpPassword.length < 8) return alert('Password too short');
    if (/[a-zA-Z]/.test(signUpPassword) === false)
      return alert('Password must contain alphabet character.');
    if (/[0-9]/.test(signUpPassword) === false)
      return alert('Password must contain numeric character.');
    if (/(?=.*[!@#$%^&*])/.test(signUpPassword) === false)
      return alert('Password must contain special character.');
    signUp();
  };

  const checkFieldSignIn = () => {
    if (!signInEmail) return alert('Please enter your email');
    if (!EmailVerificationRegex.test(signInEmail))
      return alert('Please enter valid email');
    if (!signInPassword) return alert('Please enter your password');
    signIn();
  };
  const signIn = async () => {
    setLoading(true);
    let payload = {
      username: signInEmail,
      password: signInPassword,
    };
    signInAPI(payload)
      .then(response => {
        console.log(
          '🚀 ~ file: index.js ~ line 60 ~ signInAPI ~ response',
          response.data.token,
        );
        setLoading(false);
        if (response.status == 200) {
          AsyncStorage.setItem(
            'authToken',
            JSON.stringify(response.data.token),
          );
          AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          navigation.dispatch(StackActions.replace('BottonStack'));
        }
      })
      .catch(err => {
        Alert.alert('SORFIT', 'Invalid email or password', [
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

  const signUp = async () => {
    setLoading(true);
    let payLoad = {
      first_name: firstName,
      last_name: lastName,
      height: height,
      weight: weight,
      email: signUpEmail,
      password: signUpPassword,
    };
    signupAPI(payLoad)
      .then(response => {
        setLoading(false);
        if (response.status == 201) {
          setSignUpEmail('');
          setSignUpPassword('');
          setHeight('');
          setFirstName('');
          setLastName('');
          setActiveTab(true);
          alert('Signed up successfully!');
        }
      })
      .catch(err => {
        alert('A user is already registered with this e-mail address.');
        setLoading(false);
        console.log('🚀 ~ file: index.js ~ line 56 ~ signUp ~ err', err);
      });
  };

  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{flex: 1}}>
      <TouchableHighlight
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{flex: 1}}>
        <View style={styles.container}>
          {AppLoading.renderLoading(loading)}
          <View style={styles.logoContainer}>
            <Image
              resizeMode="contain"
              style={styles.logoStyle}
              source={images.gradianLogo}
            />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.tabShiftContainer}>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab(true);
                }}
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
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setActiveTab(false);
                }}
                style={[
                  styles.authButton,
                  {
                    borderBottomColor: activeTab
                      ? colors.grey
                      : colors.darkOrange,
                  },
                ]}>
                <Text
                  style={[
                    styles.authButtonText,
                    {color: activeTab ? colors.grey : colors.darkOrange},
                  ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab ? (
              <View style={styles.inputFieldsContainer}>
                <Input
                  onChangeText={setSignInEmail}
                  value={signInEmail}
                  Placeholder="E-mail"
                  keyboardType="email-address"
                />
                <Input
                  secureTextEntry={true}
                  Placeholder="Password"
                  value={signInPassword}
                  onChangeText={setSignInPassword}
                  InputStyle={{marginTop: Utils.resHeight(35)}}
                />
                <View style={styles.socialButtonsContainer}>
                  {/* <Button
                    ButtonStyle={styles.socialButton}
                    IconStyle={styles.socialButtonIcon}
                    Icon={images.fblogo}
                    titleStyle={styles.socialButtonText}
                    title={'Sign in with Facebook'}
                    imageContainer={styles.socialImageContainer}
                    textContainer={styles.socialButtonTextContainer}
                  />
                  <Button
                    ButtonStyle={styles.socialButton}
                    IconStyle={styles.socialButtonIcon}
                    Icon={images.googleLogo}
                    titleStyle={styles.socialButtonText}
                    title={'Sign in with Google'}
                    imageContainer={styles.socialImageContainer}
                    textContainer={styles.socialButtonTextContainer}
                  />
                  <AppleButton
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                      width: 160,
                      height: 45,
                    }}
                    onPress={() =>
                      onAppleButtonPress().then(() =>
                        console.log('Apple sign-in complete!'),
                      )
                    }
                  /> */}
                </View>
                <Button
                  onPress={() => checkFieldSignIn()}
                  textContainer={styles.textContainer}
                  title={'Sign In'}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgetPassword')}
                  style={{marginTop: Utils.resHeight(30)}}>
                  <Text style={styles.passwordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputFieldsContainer}>
                <View style={styles.inputContainer}>
                  <Input
                    onChangeText={setFirstName}
                    InputStyle={styles.inputField}
                    Placeholder="First Name"
                    value={firstName}
                  />
                  <Input
                    onChangeText={setLastName}
                    InputStyle={styles.inputField}
                    Placeholder="Last Name"
                    value={lastName}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Input
                    onChangeText={setHeight}
                    InputStyle={styles.inputField}
                    Placeholder="Height"
                    value={height}
                    keyboardType="decimal-pad"
                  />
                  <Input
                    onChangeText={setWeight}
                    InputStyle={styles.inputField}
                    Placeholder="Weight"
                    value={weight}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Input
                  onChangeText={setSignUpEmail}
                  value={signUpEmail}
                  Placeholder="E-mail"
                  keyboardType="email-address"
                />
                <Input
                  onChangeText={setSignUpPassword}
                  Placeholder="Create Password"
                  InputStyle={{marginVertical: Utils.resHeight(35)}}
                  value={signUpPassword}
                  secureTextEntry={true}
                />
                <Button
                  onPress={checkField}
                  ButtonStyle={{marginTop: Utils.resHeight(35)}}
                  textContainer={styles.textContainer}
                  title={'Sign Up'}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableHighlight>
    </KeyboardAwareScrollView>
  );
};
export default Auth;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoStyle: {
    height: Utils.resHeight(35),
    width: '80%',
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
    alignItems: 'center',
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
    justifyContent: 'center',
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
});

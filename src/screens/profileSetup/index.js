import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Keyboard,
  Modal,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//API's
import {getProfile} from '../../API/methods/profile';
import {updateProfileData} from '../../API/methods/updateProfile';
//Components
import Input from '../../components/Input';
import Button from '../../components/Button';
import AppLoading from '../../components/AppLoading';
//Images
import images from '../../Assets';
//Utils
import colors from '../../utils/colors';
import {Utils, width} from '../../utils/Dimensions';
const profileSetup = ({navigation}) => {
  const focused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [imagePath, setImagePath] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const EmailVerificationRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  useEffect(() => {
    if (focused) {
      getUserProfile();
    }
  }, [focused]);

  const getUserProfile = async () => {
    setLoading(true);
    getProfile()
      .then(response => {
        AsyncStorage.setItem('user', JSON.stringify(response.data));
        // console.log("🚀 ~ file: index.js ~ line 50 ~ getUserProfile ~ response", response.data.profile_picture.split("?"))
        let profileString = response?.data?.profile_picture?.split('?');
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setHeight(response.data.height);
        setWeight(response.data.weight);
        setEmail(response.data.email);
        setProfilePic(profileString[0]);
        setLoading(false);
      })
      .catch(error => {
        console.log('🚀 line 45 ~ getProfile ~ error', error);
        setLoading(false);
      });
  };

  const checkField = () => {
    if (!firstName) return alert('Please enter your First name');
    if (!lastName) return alert('Please enter your Last name');
    if (!height) return alert('Please enter your height');
    if (!weight) return alert('Please enter your weight');
    if (!email) return alert('Please enter your email');
    if (!EmailVerificationRegex.test(email))
      return alert('Please enter valid email');
    updateProfile();
  };

  const updateProfilePic = async () => {
    setLoading(true);
    if (imagePath) {
      let authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        authToken = JSON.parse(authToken);
      }
      const data = new FormData();
      data.append('profile_picture', {
        uri: imagePath.uri,
        name: moment().format('x') + '.jpeg',
        type: 'image/jpeg',
      });
      axios
        .patch('https://six-axis-26661.botics.co/rest-auth/user/', data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `token ${authToken}`,
          },
        })
        .then(response => {
          checkField();
          setLoading(false);
        })
        .catch(error => {
          console.log('🚀line 85 ~ updateProfilePicture ~ error', error);
          setLoading(false);
        });
    } else {
      checkField();
    }
  };

  const updateProfile = async () => {
    let data = {
      first_name: firstName,
      last_name: lastName,
      height: height,
      weight: weight,
      email: email,
    };
    updateProfileData(data)
      .then(response => {
        AsyncStorage.setItem('user', JSON.stringify(response.data));
        alert('Profile Updated!');
        setLoading(false);
      })
      .catch(error => {
        console.log('🚀line 117 updateProfileData ~error', error);
        setLoading(false);
      });
  };

  const captureImage = async type => {
    let options = {
      mediaType: 'photo',
      saveToPhotos: false,
    };
    await launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setImagePath(response.assets[0]);
    });
  };
  const chooseFile = async () => {
    let options = {
      mediaType: 'photo',
      cropperCircleOverlay: true,
      cropping: true,
    };
    await launchImageLibrary(options, response => {
      console.log('showImagePicker =======>', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImagePath(response.assets[0]);
      }
    });
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{flex: 1}}>
      <View style={styles.container}>
        {AppLoading.renderLoading(loading)}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.backArrow} source={images.arrowDown} />
          </TouchableOpacity>
          <Image style={styles.logo} source={images.gradianLogo} />
          <View style={styles.backArrow} />
        </View>
        <TouchableOpacity
          onPress={() => setImagePickerModal(true)}
          style={styles.profilePicView}>
          <View
            style={[styles.profilePicView, {overflow: 'hidden', marginTop: 0}]}>
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={
                imagePath
                  ? {uri: imagePath.uri}
                  : profilePic
                  ? {uri: profilePic}
                  : images.person
              }
            />
          </View>
          <Image style={styles.cameraIcon} source={images.camera} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
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
          {/* <View style={styles.inputContainer}> */}
          <Input
            onChangeText={setEmail}
            InputStyle={{textAlign: 'left'}}
            Placeholder="Email"
            value={email}
            keyboardType="email-address"
            editable={false}
          />
          {/* <Input
            onChangeText={setUserName}
            InputStyle={styles.inputField}
            Placeholder="User Name"
            value={userName}
          />
        </View> */}
          <Button
            onPress={() => updateProfilePic()}
            ButtonStyle={{marginTop: '10%'}}
            titleStyle={{alignSelf: 'center'}}
            title={'Save'}
          />
        </View>
        <Modal animationType="slide" transparent visible={imagePickerModal}>
          <View style={styles.modalContainer}>
            <View style={styles.optionsView}>
              <Button
                onPress={() => setImagePickerModal(false)}
                ButtonStyle={{
                  borderBottomWidth: Utils.resHeight(1),
                  borderBottomColor: '#BE202E90',
                }}
                titleStyle={{alignSelf: 'center'}}
                title="Delete Photo"
              />
              <Button
                onPress={() => {
                  setImagePickerModal(false);
                  setTimeout(() => {
                    captureImage();
                  }, 700);
                }}
                ButtonStyle={{
                  borderBottomWidth: Utils.resHeight(1),
                  borderBottomColor: '#BE202E90',
                }}
                titleStyle={{alignSelf: 'center'}}
                title="Take Photo"
              />
              <Button
                onPress={() => {
                  setImagePickerModal(false);
                  setTimeout(() => {
                    chooseFile();
                  }, 700);
                }}
                titleStyle={{alignSelf: 'center'}}
                title="Choose Photo"
              />
            </View>
            <View style={styles.bottomButton}>
              <Button
                ButtonStyle={{
                  backgroundColor: colors.darkRed,
                }}
                onPress={() => setImagePickerModal(false)}
                titleStyle={{alignSelf: 'center'}}
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default profileSetup;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: Utils.resHeight(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  backArrow: {
    height: Utils.resHeight(30),
    width: Utils.resHeight(30),
    tintColor: colors.darkOrange,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
  },
  logo: {
    height: Utils.resHeight(30),
    width: '50%',
    resizeMode: 'contain',
  },
  profilePicView: {
    height: Utils.resHeight(100),
    width: Utils.resHeight(100),
    borderRadius: Utils.resHeight(50),
    backgroundColor: colors.grey,
    marginTop: Utils.resHeight(80),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: Utils.resHeight(30),
    height: Utils.resHeight(30),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 5,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  optionsView: {
    marginHorizontal: '2.5%',
    paddingHorizontal: '2.5%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.darkOrange,
  },
  bottomButton: {
    marginHorizontal: '2.5%',
    overflow: 'hidden',
    borderRadius: 10,
    marginVertical: Utils.resHeight(10),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Utils.resHeight(20),
  },
  inputField: {
    width: '46%',
    textAlign: 'left',
  },
  contentContainer: {
    paddingHorizontal: '10%',
    paddingTop: '15%',
  },
});

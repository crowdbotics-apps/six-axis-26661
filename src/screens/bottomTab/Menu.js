import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useIsFocused} from '@react-navigation/native';
import images from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import {Utils} from '../../utils/Dimensions';
//Api
import {logOut} from '../../API/methods/profile';
import {changePasswordApi} from '../../API/methods/updateProfile';
//Components
import Button from '../../components/Button';
import Input from '../../components/Input';
import ButtonCard from '../../components/ButtonCard';
import AppLoading from '../../components/AppLoading';
//Utils
import colors from '../../utils/colors';
const Menu = props => {
  const focused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const [logOutModal, setLogOutModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  useEffect(() => {
    if (focused) setUser();
  }, [focused]);
  const setUser = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    if (user.profile_picture) {
      let profileString = user.profile_picture.split('?');
      setProfileUrl(profileString[0]);
    }
    setUserData(user);
  };
  const logOutUser = () => {
    setLoading(true);
    logOut()
      .then(response => {
        console.log(
          '🚀 ~ file: Menu.js ~ line 31 ~ logOut ~ response',
          response.data,
        );
        AsyncStorage.clear();
        setLoading(false);
        props.navigation.dispatch(StackActions.replace('Auth'));
      })
      .catch(error => {
        console.log('🚀 ~ file: Menu.js ~ line 34 ~ logOut ~ error', error);
        setLoading(false);
      });
  };
  const checkField = () => {
    if (!oldPassword) return alert('Please enter your old password');
    if (!newPassword) return alert('Please enter new password');
    if (newPassword.length < 8) return alert('New password too short');
    if (/[a-zA-Z]/.test(newPassword) === false)
      return alert('Password must contain alphabet character.');
    if (/[0-9]/.test(newPassword) === false)
      return alert('Password must contain numeric character.');
    if (/(?=.*[!@#$%^&*])/.test(newPassword) === false)
      return alert('Password must contain special character.');
    if (!confirmPassword) return alert('Please enter confirm password');
    if (newPassword != confirmPassword)
      return alert(`New password and confirm password doesn't match`);
    setChangePasswordModal(false);
    changePassword();
  };
  const changePassword = () => {
    setLoading(true);
    let data = {
      old_password: oldPassword,
      new_password1: newPassword,
      new_password2: confirmPassword,
    };
    changePasswordApi(data)
      .then(response => {
        if (response.status == 200) {
          alert('Password updated successfully!');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
        // console.log("🚀 ~ file: Menu.js ~ line 79 ~ changePasswordApi ~ response", response)
        setLoading(false);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: Menu.js ~ line 81 ~ changePasswordApi ~ error',
          error,
        );
        setLoading(false);
      });
  };
  return (
    <View style={styles.mainContainer}>
      {AppLoading.renderLoading(loading)}
      <LinearGradient
        start={{x: 0, y: 1.8}}
        end={{x: 1, y: 0}}
        colors={['#F9B041', '#BE202E']}
        style={styles.linearGradient}>
        {/* <Button
        onPress={() => {
          AsyncStorage.clear();
          props.navigation.dispatch(StackActions.replace('Auth'));
        }}
        textContainer={styles.textContainer}
        title={'Sign Out'}
        ButtonStyle={styles.button}
      /> */}
        <View style={styles.header}>
          <View style={styles.logOutButton} />
          <View style={styles.profileImageContainer}>
            <Image
              source={profileUrl ? {uri: profileUrl} : images.person}
              style={styles.profileImageStyle}
            />
          </View>
          <TouchableOpacity onPress={() => setLogOutModal(true)}>
            <Image style={styles.logOutButton} source={images.logOut} />
          </TouchableOpacity>
        </View>
        {userData && (
          <View style={styles.nameContainer}>
            <Text style={styles.nameTextStyle}>
              {userData.first_name + ' ' + userData.last_name}
            </Text>
          </View>
        )}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.buttonsViewContainer}>
            <View style={styles.buttonsContainer}>
              <ButtonCard
                onPress={() => {
                  props.navigation.navigate('profileSetup');
                }}
                image={images.person}
                title={'Profile Settings'}
              />
              <ButtonCard image={images.setting} title={'Account Settings'} />
            </View>
            <View style={styles.buttonsContainer}>
              <ButtonCard
                onPress={() => {}}
                image={images.payment}
                title={'Manage Payments'}
              />
              <ButtonCard image={images.history} title={'Workout History'} />
            </View>
            <ButtonCard
              onPress={() => setChangePasswordModal(true)}
              image={images.changePassword}
              title={'Change Password'}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <Modal animationType="slide" transparent visible={logOutModal}>
        <View style={styles.modalContainer}>
          {/* <Pressable
            style={{flex: 1}}
            onPress={() => setLogOutModal(false)}></Pressable> */}
          <View style={styles.modalContentContainer}>
            <View style={styles.logOutModalTitleView}>
              <Text style={styles.logOutModalTitle}>
                Are you sure you want to logout
              </Text>
            </View>
            <View style={styles.logOutModalButtons}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setLogOutModal(false);
                  }}
                  style={styles.logOutModalButton}>
                  <Text style={styles.logOutModalButtonTitle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    logOutUser();
                  }}
                  style={styles.logOutModalButton}>
                  <Text style={styles.logOutModalButtonTitle}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent visible={changePasswordModal}>
        <Pressable
          onPress={() => setChangePasswordModal(false)}
          style={styles.chanegePasswordModalContainer}>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              borderRadius: Utils.resHeight(20),
              paddingHorizontal: Utils.resHeight(20),
            }}>
            <Text style={styles.chanegePasswordModalTitle}>
              Change Password
            </Text>
            <Input
              onChangeText={setOldPassword}
              InputStyle={{textAlign: 'left'}}
              Placeholder="Old Password"
              value={oldPassword}
              keyboardType="visible-password"
            />
            <Input
              onChangeText={setNewPassword}
              InputStyle={{textAlign: 'left'}}
              Placeholder="New Password"
              value={newPassword}
              // keyboardType="visible-password"
              secureTextEntry={true}
            />
            <Input
              onChangeText={setConfirmPassword}
              InputStyle={{
                textAlign: 'left',
                marginBottom: Utils.resHeight(20),
              }}
              Placeholder="Confirm Password"
              value={confirmPassword}
              // keyboardType="visible-password"
              secureTextEntry={true}
            />
            <View
              style={{
                width: '60%',
                alignSelf: 'center',
                marginVertical: Utils.resHeight(20),
              }}>
              <Button
                onPress={() => checkField()}
                ButtonStyle={{marginTop: '10%'}}
                titleStyle={{alignSelf: 'center'}}
                title={'Save'}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
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
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
  },
  workoutContainer: {},
  profileImageContainer: {
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: Utils.resHeight(150),
    width: Utils.resWidth(300),
    height: Utils.resWidth(300),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  profileImageStyle: {
    height: '100%',
    width: '100%',
  },
  nameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameTextStyle: {
    color: 'white',
    fontSize: Utils.resHeight(20),
    marginTop: Utils.resHeight(10),
  },
  logOutButton: {
    height: Utils.resWidth(100),
    width: Utils.resWidth(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Utils.resHeight(70),
    paddingHorizontal: '5%',
  },
  buttonsViewContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: Utils.resHeight(60),
    marginHorizontal: '5%',
    borderRadius: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: Utils.resHeight(60),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000060',
  },
  modalContentContainer: {
    flex: 0.3,
    borderTopLeftRadius: Utils.resHeight(30),
    borderTopRightRadius: Utils.resHeight(30),
    backgroundColor: colors.white,
  },
  logOutModalTitleView: {
    alignSelf: 'center',
    borderBottomWidth: Utils.resHeight(1),
    height: Utils.resHeight(40),
    paddingHorizontal: '2%',
    borderBottomColor: colors.darkOrange,
    marginTop: Utils.resHeight(30),
  },
  logOutModalTitle: {
    fontSize: Utils.resHeight(22),
    color: colors.darkOrange,
  },
  logOutModalButtons: {
    flex: 1,
    justifyContent: 'center',
    // alignItems:"center"
  },
  logOutModalButton: {
    height: Utils.resHeight(60),
    width: Utils.resWidth(600),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOrange,
    marginHorizontal: '2%',
  },
  logOutModalButtonTitle: {
    color: colors.white,
    fontSize: Utils.resHeight(22),
  },
  chanegePasswordModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060',
  },
  chanegePasswordModalTitle: {
    textAlign: 'center',
    marginVertical: Utils.resHeight(20),
    fontSize: Utils.resHeight(30),
  },
});
